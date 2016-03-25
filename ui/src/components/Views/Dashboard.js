import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

let name = { value: `` }

export default ({
  logout,
  subjects,
  openModal,
  handleDrop,
  toggleSubjectEditing,
  editingSubject,
  getDocument,
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
      <div key={ s.name }>
        <div className="name-row">
          <div className="subject-name">
            { editingSubject
              ? <input ref={ node => name = node } autoFocus type="text" defaultValue={ s.name } />
              : s.name
            }
            <i
              onClick={ () => toggleSubjectEditing({ name: name.value, id: s.id }) }
              className={ `fa fa-${editingSubject ? `check` : `edit`}` }
            />
          </div>
          <div className="subject-toolbar">
            <button
              onClick={ () => openModal(`NewDocument`) }
            >
              Add Document
            </button>
            <button
              className="delete-btn"
              onClick={ () => openModal(`Confirm`) }
            >
              Delete Subject
            </button>
          </div>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Title</th>
              </tr>
            </thead>
            <tbody>
              { s.documents.map(d =>
              <tr key={ d.name }>
                <td>
                  <a onClick={ () => getDocument({ id: d.id }) }>{ d.name }</a>
                </td>
              </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}
    </div>
  </div>
</div>
