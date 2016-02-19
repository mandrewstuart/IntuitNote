import React from 'react'
import Dropzone from 'react-dropzone'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default ({
  logout,
  subjects,
  openModal,
  handleDrop,
  toggleSubjectEditing,
  editingSubject,
  ...props,
}) =>
<div className="app dashboard">
  <Sidebar openModal={ openModal } subjects={ subjects } { ...props } />

  <div className="main-area">
    <Topbar logout={ logout } />

    <div className="subject-area">
      { !subjects.length &&
      <div className="start-message">
        <i className="fa fa-long-arrow-left"></i> Click here to start!
      </div>
      }
      { subjects.filter(s => s.active).map(s =>
      <div>
        <div className="title-row">
          <div className="subject-title">
            { editingSubject
              ? <input type="text" defaultValue={ s.title } />
              : s.title
            }
            <i onClick={ toggleSubjectEditing } className="fa fa-edit" />
          </div>
          <button
            className="delete-btn"
            onClick={ () => openModal(`Confirm`) }
          >
            Delete Subject
          </button>
        </div>

        <div className="subject-data">
          <div className="paste-text-info">
            <button>Enter text manually</button>
          </div>
          <div className="dropzone">
            <Dropzone onDrop={ handleDrop }>
              <div className="dnd-hint">
                Drag and drop a file here to start extracting data
              </div>
              <div className="select-hint">or click to select files from your computer</div>
            </Dropzone>
          </div>
        </div>
      </div>
      )}
    </div>
  </div>
</div>
