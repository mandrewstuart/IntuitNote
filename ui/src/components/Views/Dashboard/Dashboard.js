import React from 'react'
import { connect } from 'react-redux'
import { logout } from 'dux/auth'
import { toggleModal } from 'dux/modal'
import { tagSentence } from 'dux/documents'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import Document from './Document'
import DocumentsList from './DocumentsList'

// import Tooltip from 'material-ui/lib/tooltip'

let name = { value: `` }

let Dashboard = ({
  subjects,
  editingSubject,
  dispatch,
  documents,
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

            { !!documents.length && documents.some(d => d.active) &&
              documents.filter(d => d.active).map(d =>
                <div key={ d.id || d.doc_id }>
                  <div>{ d.name || d.doc_name }</div>
                  <div>
                    <div>
                      { d.sentences.map(s =>
                        <span
                          key={ s.id }
                          onClick={ () => dispatch(tagSentence({ sentence: s })) }
                          className={ `sentence ${ s.tag_value ? `tagged` : `` }` }
                        >
                          { s.value }
                          {/*{ s.tag_value &&
                            <Tooltip show label={ s.tag_value } />
                          }*/}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            }

            { !!documents.length && documents.every(d => !d.active) &&
              <DocumentsList />
            }
            
            { !!documents.length ||
              <div>Begin by adding a document!</div>
            }
          </div>
        )}
      </div>
    </div>
  </div>

export default connect(
  state => ({
    ...state.subjects,
    ...state.documents,
  })
)(Dashboard)
