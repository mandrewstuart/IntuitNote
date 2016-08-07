import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'
import { deleteSubject } from 'dux/subjects'

let Confirm = ({
  message,
  subject,
  dispatch,
}) =>
  <div className="confirm modal-content">
    <div className="modal-title">DELETE SUBJECT?</div>
    <div className="new-subject form">
      <div className="button-row">
        <button className="delete" onClick={ () =>
          dispatch(deleteSubject({ id: subject.id }))
        }>
          YES, DELETE
        </button>
        <button onClick={ () => dispatch(toggleModal()) }>NO, CANCEL</button>
      </div>
      <div className="error">{ message }</div>
    </div>
  </div>

export default connect(
  state => ({
    ...state.message,
    ...state.subjects,
  })
)(Confirm)
