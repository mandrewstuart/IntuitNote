import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'
import { createDocument } from 'dux/documents'
import Dropzone from 'react-dropzone'

let title, author, publication, date, text

let NewDocument = ({
  message,
  subjects,
  dispatch,
  handleDrop,
}) =>
<div className="modal-content new-document">
  <div className="close-btn" onClick={ () => dispatch(toggleModal()) }>CLOSE ✕</div>
  <div className="modal-title">Add A Document</div>
  <div className="subject-data">
    {/*<div className="paste-text-info">
      <button>Enter text manually</button>
    </div>*/}

    <input ref={ node => title = node } type="text" placeholder="Title.." />
    <label>Title</label>

    <input ref={ node => author = node } type="text" placeholder="Author.. (optional)" />
    <label>Author</label>

    <input ref={ node => publication = node } type="text" placeholder="Publication.. (optional)" />
    <label>Publication</label>

    <div style={{ marginTop: `1rem` }}>
      <textarea
        ref = { node => text = node }
        placeholder="Paste text here.."
      />
    </div>

    {/*<div className="dropzone">
      <Dropzone onDrop={ handleDrop }>
        <div className="dnd-hint">
          Drag and drop a file here to start extracting data
        </div>
        <div className="select-hint">or click to select files from your computer</div>
      </Dropzone>
    </div>*/}

    <div>
      <button
        onClick={
          () => dispatch(createDocument({
            title: title.value,
            author: author.value,
            publication: publication.value,
            text: text.value,
            id: subjects.find(s => s.active).id,
          }))
        }
      >
        Add Document
      </button>
    </div>
  </div>
</div>

export default connect(
  state => ({
    ...state.subjects,
    ...state.message,
  })
)(NewDocument)
