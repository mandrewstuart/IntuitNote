import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'
import { getSubject } from 'dux/subjects'
import { logout } from 'dux/auth'
let Sidebar = ({
  user,
  subject,
  subjects,
  dispatch,
}) =>
  <div className="sidebar z-depth-2">
    <div className="logo center">IntuitNote</div>
    <div className="greeting">
      <div className="welcome">Welcome</div>
      <i className="fa fa-user" />
      <span>{ user.email }</span>
    </div>
    <div className="subject-nav">
      <div
        className="subject-nav-item"
        onClick={ () => dispatch(toggleModal(`NewSubject`)) }
      >
        <a className="new-subject">New Subject</a>
        <i className="fa fa-plus" />
      </div>
      { subjects.map(s =>
        <div
          key={ s.id }
          className={ `subject-nav-item ${s.id === subject.id ? `active` : ``}` }
          onClick={ () => dispatch(getSubject({ id: s.id, redirect: true })) }
        >
          <a className="new-subject">{ s.name }</a>
          <i className="fa fa-file" />
        </div>
      )}
    </div>
    <a
    onClick={ () => dispatch(logout()) }>Logout</a>
  </div>

export default connect(
  state => ({
    ...state.auth,
    ...state.subjects,
  })
)(Sidebar)
