import React, { Component } from 'react'
import { connect } from 'react-redux'
import { getSubjects } from 'dux/subjects'
import { toggleModal } from 'dux/modal'
import Dialog from 'material-ui/lib/dialog'

export class App extends Component {
  componentDidMount = () => {
    this.props.dispatch(getSubjects())
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
