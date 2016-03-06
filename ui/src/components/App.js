import React, { Component, Children, cloneElement, PropTypes } from 'react'

/*----------------------------------------------------------------------------*/

import { domain } from 'config'
import auth from '../auth'
import isAValidEmail from 'utils/isEmail'
import api from 'utils/api'

/*----------------------------------------------------------------------------*/

import Modals from 'components/Modals'
import Dialog from 'material-ui/lib/dialog'

/*----------------------------------------------------------------------------*/

import io from 'socket.io-client'
let socket = io(`${domain}:8080`)

export default class App extends Component {
  static contextTypes = { router: PropTypes.object };

  constructor (props) {
    super(props)
    this.state = {

      /*
       *  User State
       */

      loggedIn: auth.loggedIn(),
      user: { email: localStorage.userEmail },
      subjects: [],

      /*
       *  UI State
       */

      ModalComponent: Modals[`AuthModal`],
      modalOpen: false,
      editingSubject: false,
    }
  }

  /*
   *  Startup
   */

  componentDidMount = () => {
    this.getSubjects()
  }

  getSubjects = async () => {
    let { subjects } = await api({ endpoint: `getSubjects` })
    this.setState({ subjects })
  }

  /*
   *  UI State Logic
   */

   openModal = modal =>
     this.setState({ modalOpen: true, ModalComponent: Modals[modal] });

   closeModal = () =>
     this.setState({ modalOpen: false, message: `` });

  /*
   *  Auth Logic
   */

  login = (type, { email, password }) => {
    if (!isAValidEmail(email))
      return this.setState({ message: `Invalid email` })

    auth[type]({ email, password }, response => {
      if (response.success) {

        console.log(response.user)

        this.setState({
          loggedIn: response.success,
          user: response.user,
          subjects: [ ...response.user.subjects ],
          modalOpen: false,
          message: ``,
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

  /*
   *  User Logic
   */

  createSubject = async ({ name }) => {
    if (!name) return this.setState({ message: `Please name your subject!` })

    let { id } = await api({
      endpoint: `createSubject`,
      body: { name }
    })

    console.log(`Subject created! ID: `, id)

    this.setState({
      subjects: [
        ...this.state.subjects.map(s => ({ ...s, active: false })),
        {
          name,
          id,
          active: true,
          createdDate: +new Date(),
          updatedDate: +new Date(),
          docs: [],
        },
      ],
      message: ``,
      modalOpen: false,
    })
  };

  getSubject = async ({ id }) => {
    let data = await api({
      endpoint: `getSubject`,
      body: { id }
    })

    console.log('Retrieved subject:', data)

    this.setState({
      subjects:
        this.state.subjects.map(s => ({ ...s, active: s.id === id })),
    })
  };

  deleteSubject = async ({ id }) => {
    let data = await api({
      endpoint: `deleteSubject`,
      body: { id },
    })

    this.setState({
      subjects: this.state.subjects.filter(s => s.id !== id ),
      modalOpen: false,
    })
  };

  toggleSubjectEditing = async ({ id, name }) => {
    if (this.state.editingSubject) {
      let data = await api({
        endpoint: `updateSubject`,
        body: { id, name }
      })
      let { subjects } = this.state
      subjects.find(x => x.id === id).name = name
      this.setState({ subjects })
    }
    this.setState({ editingSubject: !this.state.editingSubject })
  };

  handleDrop = event => {
    console.log(event)
  };

  addDocument = async ({ name, author, text, subjectId }) => {
    let data = await api({
      endpoint: `newDocument`,
      body: { name, author, text, subjectId },
    })

    this.setState({
      message: ``,
      modalOpen: false,
    })
  };

  render() {
    let { ModalComponent, subjects } = this.state

    let children = Children.map(this.props.children, child => {
      return cloneElement(child, {
        ...child.props,
        ...this.props,
        ...this.state,
        login: this.login,
        logout: this.logout,
        openModal: this.openModal,
        closeModal: this.closeModal,
        getSubject: this.getSubject,
        deleteSubject: this.deleteSubject,
        toggleSubjectEditing: this.toggleSubjectEditing,
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

            // conditionally add these
            createSubject={ this.createSubject }
            deleteSubject={ this.deleteSubject }
            subjects={ subjects }
            handleDrop={ this.handleDrop }
          />
        </Dialog>

        { children }
      </div>
    )
  }
}
