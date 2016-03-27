import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'
import { createSubject } from 'dux/subjects'

let name

let NewSubject = ({
  message,
  dispatch,
}) =>
  <div className="new-subject modal-content">
    <div className="close-btn" onClick={ () => dispatch(toggleModal()) }>CLOSE ✕</div>
    <div className="modal-title">Create New Subject</div>
    <div className="new-subject form">
      <input ref={ node => name = node } placeholder="Name.." />
      <div className="button-row">
        <button onClick={ () => dispatch(createSubject({ name: name.value })) }>
          + Create
        </button>
      </div>
      <div className="error">{ message }</div>
    </div>
  </div>

export default connect(
  state => ({
    ...state.message,
  })
)(NewSubject)
