import React from 'react'

export default ({
  user,
  openModal,
  subjects,
  setSubject,
}) =>
<div className="sidebar">
  <div className="greeting">
    <div className="welcome">Welcome</div>
    <i className="fa fa-user" />
    <span>{ user.email }</span>
  </div>
  <div className="subject-nav">
    <div
      className="subject-nav-item"
      onClick={ () => openModal(`newSubject`) }
    >
      <a className="new-subject">New Subject</a>
      <i className="fa fa-plus" />
    </div>
    { subjects.map(s =>
    <div
      className={ `subject-nav-item ${s.active ? `active` : ``}` }
      onClick={ () => setSubject(s.title) }
    >
      <a className="new-subject">{ s.title }</a>
      <i className="fa fa-file" />
    </div>
    )}
  </div>
</div>
