import React from 'react'

export default ({
  logout,
}) =>
<div className="top-row">
  <a
    className="sign-out hvr-underline-from-left"
    onClick = { logout }
  >
    Sign Out
  </a>
  <a className="account-settings hvr-underline-from-right">Account Settings</a>
  <span className="plan-message">
    <i className="fa fa-warning" />
    You are currently on the free plan.
    Go to your account settings and upgrade to
    <span className="underline">add more subjects!</span>
  </span>
</div>