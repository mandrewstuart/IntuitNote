import React from 'react'
import { Link } from 'react-router'

export default ({
  logout,
  loggedIn,
  user,
  openAuthModal,
}) =>
  <div>
    <div className="header z-depth-1">
      <Link className="logo" to="/">Apprentice Data Extractor</Link>

      <div className="menu">
        <a className="hvr-underline-from-right">Pricing</a>
        { loggedIn ||
        <a className="hvr-underline-from-left" onClick={ openAuthModal }>
          Login / Register
        </a>
        }
        { loggedIn &&
        <div>
          <span>Welcome, { user.email }</span>
          <a onClick={ logout }>Log out</a>
        </div>
        }
      </div>
    </div>
  </div>
