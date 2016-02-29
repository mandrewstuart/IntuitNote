import React, { Component, Children, cloneElement, PropTypes } from 'react'
import { observer } from 'mobx-react'
import Store, { connect } from '../Store'

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

@connect(Store)
@observer
export default class App extends Component {
  static contextTypes = { router: PropTypes.object };

  /*
   *  Startup
   */

  componentDidMount = () => {
    if (this.props.$.loggedIn) this.getSubjects()
  };

  getSubjects = async () => {
    let { subjects } = await api({ endpoint: `getSubjects` })
    this.props.$.subjects = subjects

    console.log('after getting subjects', this.props.$)
  };

  /*
   *  UI State Logic
   */

   openModal = modal => {
     this.props.$.modalOpen = true
     this.props.$.ModalComponent = Modals[modal]
   };

   closeModal = () => {
     this.props.$.modalOpen = false
     this.props.$.message = ``
   };

  /*
   *  Auth Logic
   */

  login = (type, { email, password }) => {
    if (!isAValidEmail(email))
      return this.props.$.message = `Invalid email`

    auth[type]({ email, password }, response => {
      if (response.success) {

        this.props.$.loggedIn = response.success
        this.props.$.user = response.user
        this.props.$.subjects = [ ...response.user.subjects ]
        this.props.$.modalOpen = false
        this.props.$.message = ``

        console.log('after login', this.props.$)

        this.context.router.replace(`/dashboard`)
      }

      else this.props.$.message = response.message
    })
  };

  logout = () => {
    localStorage.clear()
    this.context.router.replace(`/`)
    this.props.$.loggedIn = false

    console.log('logout', this.props.$.loggedIn)
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

    this.props.$.subjects = [
      ...this.props.$.subjects.map(s => ({ ...s, active: false })),
      {
        name,
        id,
        active: true,
        createdDate: +new Date(),
        updatedDate: +new Date(),
        docs: [],
      },
    ]

    this.props.$.message = ``
    this.props.$.modalOpen = false
  };

  setSubject = async ({ id }) => {
    let data = await api({
      endpoint: `getSubject`,
      body: { id }
    })

    console.log('Retrieved subject:', data)

    this.props.$.subjects = this.state.subjects.map(s => ({ ...s, active: s.id === id }))
  };

  deleteSubject = ({ name }) => {
    /*
     *  TODO: call delete endpoint
     */

    this.props.$.subjects = this.props.$.subjects.filter(s => s.name !== name)
    this.props.$.modalOpen = false
  };

  toggleSubjectEditing = () =>
    this.props.$.editingSubject = !this.props.$.editingSubject;

  handleDrop = event => {
    console.log(event)
  };

  addDocument = async ({ name, author, text, subjectId }) => {
    let data = await api({
      endpoint: `newDocument`,
      body: { name, author, text, subjectId },
    })

    this.props.$.message = ``
    this.props.$.modalOpen = false
  };

  render() {
    let {
      ModalComponent,
      modalOpen,
      subjects,
      message,
    } = this.props.$

    let children = Children.map(this.props.children, child => {
      return cloneElement(child, {
        ...child.props,
        ...this.props,
        login: this.login,
        logout: this.logout,
        openModal: this.openModal,
        closeModal: this.closeModal,
        setSubject: this.setSubject,
        deleteSubject: this.deleteSubject,
        toggleSubjectEditing: this.toggleSubjectEditing,
        socket,
      })
    })

    console.log('render', this.props.$.loggedIn)

    return (
      <div id="app">
        <Dialog
          className="auth-modal"
          open={ modalOpen }
          onRequestClose={ this.handleClose }
        >
          <ModalComponent
            closeModal={ this.closeModal }
            login={ this.login }
            message={ message }

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
