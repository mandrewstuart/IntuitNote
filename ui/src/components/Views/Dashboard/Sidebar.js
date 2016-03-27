import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'

let Sidebar = ({
  user,
  subjects,
  dispatch,
}) =>
  <div className="sidebar">
    <div className="logo center">ADE</div>
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
          className={ `subject-nav-item ${s.active ? `active` : ``}` }
          onClick={ () => dispatch(getSubject({ id: s.id })) }
        >
          <a className="new-subject">{ s.name }</a>
          <i className="fa fa-file" />
        </div>
      )}
    </div>
  </div>

export default connect(
  state => ({
    ...state.auth,
    ...state.subjects,
  })
)(Sidebar)
