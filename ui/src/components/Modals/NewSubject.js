import React from 'react'

let name

export default ({
  closeModal,
  createSubject,
  message,
}) =>
  <div className="new-subject modal-content">
    <div className="close-btn" onClick={ closeModal }>CLOSE ✕</div>
    <div className="modal-title">Create New Subject</div>
    <div className="new-subject form">
      <input ref={ node => name = node } placeholder="Name.." />
      <div className="button-row">
        <button onClick={ () => createSubject({ name: name.value }) }>
          + Create
        </button>
      </div>
      <div className="error">{ message }</div>
    </div>
  </div>
