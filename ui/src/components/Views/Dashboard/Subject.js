import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { toggleModal } from 'dux/modal'

let name = { value: `` }

let Subject = ({
  subject: s,
  editingSubject,
  dispatch,
  documents,
  children,
}) =>
  <div className="subject-area">
    <div key={ s.name }>
      <div className="name-row">
        <div className="name-row-type">SUBJECT/</div>
        <div className="subject-name">
          { editingSubject
            ? <input ref={ node => name = node } autoFocus type="text" defaultValue={ s.name } />
            : <Link to={ `/dashboard/subject/${s.id}` }>{ s.name }</Link>
          }
        </div>

        {!!documents.length &&
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
        }
      </div>
    </div>

    {!documents.length &&
      <div className="center full no-items">
        <i className="fa fa-file-o" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#209828' }}>
            Begin by adding your first document!
          </span>
          <button
            onClick={ () => dispatch(toggleModal(`NewDocument`)) }
          >
            ADD DOCUMENT
            <i className="fa fa-plus" />
          </button>
        </div>
      </div>
    }

    {!!documents.length &&
      <div>{ children }</div>
    }
  </div>

export default connect(state => ({
  ...state.subjects,
  ...state.documents,
}))(Subject)
