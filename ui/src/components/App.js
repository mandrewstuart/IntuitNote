import React, { Component, Children, cloneElement, PropTypes } from 'react'
import { Link } from 'react-router'
import io from 'socket.io-client'

/*----------------------------------------------------------------------------*/

import { domain } from 'config'
import auth from '../auth'
import isAValidEmail from 'utils/isEmail'

/*----------------------------------------------------------------------------*/

import Modals from 'components/Modals'
import Dialog from 'material-ui/lib/dialog'

/*----------------------------------------------------------------------------*/

let socket = io(`${domain}:8080`)

export default class App extends Component {
  static contextTypes = { router: PropTypes.object };

  constructor (props) {
    super(props)
    this.state = {
      loggedIn: auth.loggedIn(),
      user: { email: localStorage.userEmail },
      modalOpen: false,
      ModalComponent: Modals[`auth`],
    }
  }

  login = (type, { email, password }) => {
    if (!isAValidEmail(email))
      return this.setState({ message: `Invalid email` })

    auth[type]({ email, password }, response => {
      if (response.success) {
        this.setState({
          loggedIn: response.success,
          user: response.user,
          modalOpen: false,
        })

        this.context.router.replace(`/dashboard`)
      }

      else this.setState({ message: response.message })
    })
  };

  logout = () => {
    localStorage.clear()
    this.context.router.replace(`/`)
    this.setState({ loggedIn: false, headerColor: `rgb(27, 173, 112)` })
  };

  openModal = modal =>
    this.setState({ modalOpen: true, ModalComponent: Modals[modal] });

  closeModal = () =>
    this.setState({ modalOpen: false, message: `` });

  render() {
    let { ModalComponent } = this.state

    let children = Children.map(this.props.children, child => {
      return cloneElement(child, {
        ...child.props,
        ...this.props,
        ...this.state,
        setAuth: this.setAuth,
        login: this.login,
        logout: this.logout,
        openModal: this.openModal,
        closeModal: this.closeModal,
        socket,
      })
    })

    return (
      <div id="app">
        <Dialog
          className="auth-modal"
          open={ this.state.modalOpen }
          onRequestClose={ this.handleClose }
        >
          <ModalComponent
            closeModal={ this.closeModal }
            login={ this.login }
            message={ this.state.message }
          />
        </Dialog>

        { children }
      </div>
    )
  }
}
