import React from 'react'
import { observer } from 'mobx-react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default observer(({
  $,
  logout,
  handleDrop,
  toggleSubjectEditing,
  ...props,
}) =>
<div className="app dashboard">
  <Sidebar openModal={ $.openModal } subjects={ $.subjects } $={ $ } { ...props } />

  <div className="main-area">
    <Topbar logout={ logout } />

    <div className="subject-area">
      { !$.subjects.length &&
      <div className="start-message">
        <i className="fa fa-long-arrow-left" /> Click here to start!
      </div>
      }
      { $.subjects.filter(s => s.active).map(s =>
      <div key={ s.name }>
        <div className="name-row">
          <div className="subject-name">
            { $.editingSubject
              ? <input autoFocus type="text" defaultValue={ s.name } />
              : s.name
            }
            <i
              onClick={ toggleSubjectEditing }
              className={ `fa fa-${$.editingSubject ? `check` : `edit`}` }
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
      </div>
      )}
    </div>
  </div>
</div>
)
