import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { toggleModal } from 'dux/modal'

let name = { value: `` }

let Subject = ({
  subjects,
  editingSubject,
  dispatch,
  children,
}) =>
  <div className="subject-area">
    { subjects.filter(s => s.active).map(s =>
      <div key={ s.name }>
        <div className="name-row">
          <div className="subject-name">
            { editingSubject
              ? <input ref={ node => name = node } autoFocus type="text" defaultValue={ s.name } />
              : <Link to={ `/dashboard/subject/${s.id}` }>{ s.name }</Link>
            }
          </div>

          <div className="subject-toolbar">
            <button
              onClick={ () => dispatch(toggleModal(`NewDocument`)) }
            >
              ADD DOCUMENT
              <i className="fa fa-plus" />
            </button>

            <button
              className="delete-btn"
              onClick={ () => dispatch(toggleModal(`Confirm`)) }
            >
              EDIT
              <i className="fa fa-edit" />
            </button>
          </div>
        </div>
      </div>
    )}
    <div>{ children }</div>
  </div>

export default connect(
  state => ({
    ...state.subjects,
  })
)(Subject)
