import React from 'react'

export default ({
  closeModal,
  deleteSubject,
  message,
  subjects,
}) =>
  <div className="confirm modal-content">
    <div className="modal-title">Delete Subject</div>
    <div className="new-subject form">
      <div className="button-row">
        <button className="delete" onClick={ () =>
          deleteSubject({ title: subjects.find(s => s.active).id })
        }>
          YES DELETE
        </button>
        <button onClick={ closeModal }>CANCEL</button>
      </div>
      <div className="error">{ message }</div>
    </div>
  </div>
