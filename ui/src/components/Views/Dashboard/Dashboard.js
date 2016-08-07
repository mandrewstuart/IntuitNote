import React from 'react'
import { connect } from 'react-redux'
import Sidebar from './Sidebar'
import { toggleModal } from 'dux/modal'

let Dashboard = ({
  children,
  message,
  subjects,
  dispatch,
}) =>
  <div className="app dashboard">
    <Sidebar />

    <div className="main-area">
      { message === `No subject found!` ? message : children }
      { !subjects.length &&
        <div className="center full no-items">
          <i className="fa fa-folder-open-o" />
          <div style={{ display: `flex`, flexDirection: `column` }}>
            <span style={{ fontSize: `1.5rem`, marginBottom: `0.5rem`, color: `#209828` }}>
              Begin by creating your first subject!
            </span>
            <button
              onClick={ () => dispatch(toggleModal(`NewSubject`)) }
            >
              NEW SUBJECT
              <i className="fa fa-plus" />
            </button>
          </div>
        </div>
      }
      <div>

      </div>
    </div>
  </div>

export default connect(state => ({
  ...state.message,
  ...state.subjects,
}))(Dashboard)
