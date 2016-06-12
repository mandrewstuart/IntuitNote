import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSubjects, getSubject } from 'dux/subjects'
import { getDocument } from 'dux/documents'
import { toggleModal } from 'dux/modal'
import Dialog from 'material-ui/Dialog'

export class App extends Component {
  componentDidMount = () => {
    let { dispatch, params: { subject, document } } = this.props

    dispatch(getSubjects())
    //
    if (document) {
      dispatch(getDocument({
        id: document,
        subjectId: subject,
      }))
    }

    if (subject) {
      dispatch(getSubject({
        id: subject,
        redirect: !document,
      }))
    }
  }

  handleDrop = event => {
    console.log(event)
  };

  render () {
    let {
      ModalComponent,
      modalOpen,
      children,
      dispatch,
    } = this.props

    return (
      <div id="app">
        <Dialog
          className="modal-container"
          open={ modalOpen }
          onRequestClose={ () => dispatch(toggleModal()) }
        >
          <ModalComponent handleDrop={ this.handleDrop } />
        </Dialog>

        { children }
      </div>
    )
  }
}

export default connect(
  state => ({
    ...state.modal,
  })
)(App)
