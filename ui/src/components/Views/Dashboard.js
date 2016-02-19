import React from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default ({
  logout,
  subjects,
  ...props,
}) =>
<div className="app dashboard">
  <Sidebar subjects={ subjects } { ...props } />
  
  <div className="main-area">
    <Topbar logout={ logout } />
    <div className="subject-area">
      { !subjects.length &&
      <div className="start-message">
        <i className="fa fa-long-arrow-left"></i> Click here to start!
      </div>
      }
      { subjects.filter(s => s.active).map(s =>
      <div className="subject-title">{ s.title }</div>
      )}
    </div>
  </div>
</div>
