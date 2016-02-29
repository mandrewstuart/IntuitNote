import React from 'react'
import { observer } from 'mobx-react'
import { Link } from 'react-router'

export default observer(({
  $,
  logout,
  openModal,
}) =>
  <div>
    <div className="header">
      <Link className="logo" to="/">Apprentice Data Extractor</Link>

      <div className="menu">
        <a className="hvr-underline-from-right">About</a>
        <a className="hvr-underline-from-right">Pricing</a>
        { $.loggedIn ||
        <a className="hvr-underline-from-left" onClick={ () => openModal(`AuthModal`) }>
          Login / Register
        </a>
        }
        { $.loggedIn &&
        <div>
          <span>Welcome, { $.user.email }</span>
          <a onClick={ logout }>Log out</a>
        </div>
        }
      </div>
    </div>
  </div>
)
