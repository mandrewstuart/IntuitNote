import React from 'react'

export default ({
  user,
  openModal,
  subjects,
  getSubject,
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
      onClick={ () => openModal(`NewSubject`) }
    >
      <a className="new-subject">New Subject</a>
      <i className="fa fa-plus" />
    </div>
    { subjects.map(s =>
    <div
      key={ s.id }
      className={ `subject-nav-item ${s.active ? `active` : ``}` }
      onClick={ () => getSubject({ id: s.id }) }
    >
      <a className="new-subject">{ s.name }</a>
      <i className="fa fa-file" />
    </div>
    )}
  </div>
</div>
