import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSubjects, getSubject } from 'dux/subjects'
import { getDocument } from 'dux/documents'
import { toggleModal } from 'dux/modal'
import Dialog from 'material-ui/lib/dialog'

export class App extends Component {
  componentDidMount = () => {
    this.props.dispatch(getSubjects())

    if (this.props.params.document) {
      this.props.dispatch(getDocument({
        id: this.props.params.document,
        subjectId: this.props.params.subject,
      }))
    }

    else if (this.props.params.subject) {
      this.props.dispatch(getSubject({
        id: this.props.params.subject,
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
