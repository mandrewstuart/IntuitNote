import React from 'react'
import Dropzone from 'react-dropzone'

let title, author, text

export default ({
  closeModal,
  message,
  handleDrop,
  addDocument,
}) =>
<div className="modal-content new-document">
  <div className="close-btn" onClick={ closeModal }>CLOSE ✕</div>
  <div className="modal-title">Add A Document</div>
  <div className="subject-data">
    {/*<div className="paste-text-info">
      <button>Enter text manually</button>
    </div>*/}

    <input ref={ node => title = node } type="text" placeholder="Title.." />
    <label>Title</label>

    <input ref={ node => author = node } type="text" placeholder="Author.." />
    <label>Author</label>

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
          () => addDocument({
            title: title.value,
            author: author.value,
            text: text.value,
          })
        }
      >
        Add Document
      </button>
    </div>
  </div>
</div>
