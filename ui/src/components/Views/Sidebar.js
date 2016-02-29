import React from 'react'
import { observer } from 'mobx-react'

export default observer(({
  $,
  openModal,
  setSubject,
}) => { console.log($)
return (<div className="sidebar">
  <div className="logo center">ADE</div>
  <div className="greeting">
    <div className="welcome">Welcome</div>
    <i className="fa fa-user" />
    <span>{ $.user.email }</span>
  </div>
  <div className="subject-nav">
    <div
      className="subject-nav-item"
      onClick={ () => openModal(`NewSubject`) }
    >
      <a className="new-subject">New Subject</a>
      <i className="fa fa-plus" />
    </div>
    { $.subjects.map(s =>
    <div
      key={ s.id }
      className={ `subject-nav-item ${s.active ? `active` : ``}` }
      onClick={ () => setSubject({ id: s.id }) }
    >
      <a className="new-subject">{ s.name }</a>
      <i className="fa fa-file" />
    </div>
    )}
  </div>
</div>
)})
