import React, { Component, Children, cloneElement, PropTypes } from 'react'
import { Link } from 'react-router'
import io from 'socket.io-client'

/*----------------------------------------------------------------------------*/

import auth from '../auth'
import { domain } from 'config'

/*----------------------------------------------------------------------------*/

import AuthModal from 'components/AuthModal'
import Dialog from 'material-ui/lib/dialog';

/*----------------------------------------------------------------------------*/

let socket = io(`${domain}:8080`)

export default class App extends Component {
  static contextTypes = { router: PropTypes.object };

  constructor (props) {
    super(props)
    this.state = {
      loggedIn: auth.loggedIn(),
      user: { email: localStorage.userEmail },
      authModalOpen: false,
    }
  }

  login = (type, { email, password }) => {
    auth[type]({ email, password }, response => {
      if (response.success) {
        this.setState({
          loggedIn: response.success,
          user: response.user,
          authModalOpen: false,
        })

        this.context.router.replace(`/dashboard`)
      } else {
        this.setState({
          message: response.message,
        })
      }
    })
  };

  logout = () => {
    localStorage.clear()
    this.context.history.pushState(null, `/login`)
    this.setState({ loggedIn: false, headerColor: `rgb(27, 173, 112)` })
  };

  openAuthModal = () => this.setState({ authModalOpen: true })
  closeAuthModal = () => this.setState({ authModalOpen: false })

  render() {
    let children = Children.map(this.props.children, child => {
      return cloneElement(child, {
        ...child.props,
        ...this.props,
        ...this.state,
        setAuth: this.setAuth,
        login: this.login,
        openAuthModal: this.openAuthModal,
        closeAuthModal: this.closeAuthModal,
        socket,
      })
    })

    return (
      <div>
        <Dialog
          className = "auth-modal"
          open = { this.state.authModalOpen }
          onRequestClose = { this.handleClose }
        >
          <AuthModal
            closeAuthModal = { this.closeAuthModal }
            login = { this.login }
          />
        </Dialog>
        { children }
      </div>
    )
  }
}
