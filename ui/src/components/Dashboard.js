import React from 'react'

export default ({
  logout,
  user
}) =>
  <div className = "app dashboard">
    <div className = "sidebar">
      <div className = "greeting">
        <i className = "fa fa-user" />
        <span>{ user.email }</span>
      </div>
      <div className = "subject-nav">
        <div className = "subject-nav-item">
          <a className = "new-subject">New Subject</a>
          <i className = "fa fa-file" />
        </div>
      </div>
    </div>

    <div className = "main-area">
      <div className = "top-row">
        <a className = "sign-out"
          onClick = { logout }
        >Sign Out</a>
        <a className = "account-settings">Account Settings</a>
      </div>
    </div>
  </div>
