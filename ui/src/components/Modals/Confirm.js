import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'
import { deleteSubject } from 'dux/subjects'

let Confirm = ({
  message,
  subjects,
  dispatch,
}) =>
  <div className="confirm modal-content">
    <div className="modal-title">Delete Subject</div>
    <div className="new-subject form">
      <div className="button-row">
        <button className="delete" onClick={ () =>
          dispatch(deleteSubject({ id: subjects.find(s => s.active).id }))
        }>
          YES DELETE
        </button>
        <button onClick={ () => dispatch(toggleModal()) }>CANCEL</button>
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
