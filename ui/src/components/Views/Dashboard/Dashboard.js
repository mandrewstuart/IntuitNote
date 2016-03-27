import React from 'react'
import { connect } from 'react-redux'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { logout } from 'dux/auth'
import { toggleModal } from 'dux/modal'

let name = { value: `` }

let Dashboard = ({
  subjects,
  editingSubject,
  dispatch,
}) =>
  <div className="app dashboard">
    <Sidebar />

    <div className="main-area">
      <Topbar logout={ () => dispatch(logout()) } />

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
                  onClick={ () => dispatch(toggleSubjectEditing({ name: name.value, id: s.id })) }
                  className={ `fa fa-${editingSubject ? `check` : `edit`}` }
                />
              </div>
              <div className="subject-toolbar">
                <button
                  onClick={ () => dispatch(toggleModal(`NewDocument`)) }
                >
                  Add Document
                </button>
                <button
                  className="delete-btn"
                  onClick={ () => dispatch(toggleModal(`Confirm`)) }
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
                        <a onClick={ () => dispatch(getDocument({ id: d.id })) }>{ d.name }</a>
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

export default connect(
  state => ({
    ...state.subjects,
  })
)(Dashboard)
