import React from 'react'

export default ({
  logout,
  user,
  openModal,
}) =>
  <div className="app dashboard">
    <div className="sidebar">
      <div className="greeting">
        <div className="welcome">Welcome</div>
        <i className="fa fa-user" />
        <span>{ user.email }</span>
      </div>
      <div className="subject-nav">
        <div className="subject-nav-item" onClick={ () => openModal(`newSubject`) }>
          <a className="new-subject">New Subject</a>
          <i className="fa fa-file" />
        </div>
      </div>
    </div>

    <div className="main-area">
      <div className="top-row">
        <a className="sign-out hvr-underline-from-left" onClick = { logout }>Sign Out</a>
        <a className="account-settings hvr-underline-from-right">Account Settings</a>
        <span className="plan-message">
          <i className="fa fa-warning" />
          You are currently on the free plan.
          Go to your account settings and upgrade to
          <span className="underline">add more subjects!</span>
        </span>
      </div>
      <div className="start-message">
        <i className="fa fa-long-arrow-left"></i> Click here to start!
      </div>
    </div>
  </div>
