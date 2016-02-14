import React from 'react'

export default () =>
  <div className = "app dashboard">
    <div className = "sidebar">
      <div className = "greeting">
        <i className = "fa fa-user" />
        <span>Welcome, user123</span>
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
        <a className = "sign-out">Sign Out</a>
        <a className = "account-settings">Account Settings</a>
      </div>
    </div>
  </div>
