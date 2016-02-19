import React from 'react'

let title

export default ({
  closeModal,
  createSubject,
  message,
}) =>
  <div className="new-subject modal-content">
    <div className="close-btn" onClick={ closeModal }>CLOSE ✕</div>
    <div className="modal-title">Create New Subject</div>
    <div className="new-subject-form"
      style={{
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `center`,
        alignItems: `center,`,
      }}
    >
      <input ref={ node => title = node } placeholder="Title.." />
      <div className="button-row">
        <button onClick={ () => createSubject({ title: title.value }) }>
          + Create
        </button>
      </div>
      <div className="error">{ message }</div>
    </div>
  </div>
