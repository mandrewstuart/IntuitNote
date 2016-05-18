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
    <div className="modal-title">ADD DOCUMENT</div>
    <div className="subject-data">
      {/*<div className="paste-text-info">
        <button>Enter text manually</button>
      </div>*/}

      <label>Title</label>
      <input ref={ node => title = node } type="text" placeholder="eg 'Machine Learning'" />

      <label>Author (optional)</label>
      <input ref={ node => author = node } type="text" placeholder="eg 'Michael Irwin Jordan'" />

      <label>Publication (optional)</label>
      <input ref={ node => publication = node } type="text" placeholder="eg 'Journal of Machine Learning Research'" />

      <label>Text</label>
      <div style={{ margin: `1rem 0` }}>
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

      <div style={{ display: `flex`, justifyContent: `center` }}>
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
          ADD <i className="fa fa-plus" />
        </button>
      </div>
    </div>
    <div className="error">{ message }</div>
  </div>

export default connect(
  state => ({
    ...state.subjects,
    ...state.message,
  })
)(NewDocument)
