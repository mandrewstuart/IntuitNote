import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { toggleModal } from 'dux/modal'
import { logout } from 'dux/auth'

let Home = ({
  loggedIn,
  user,
  dispatch,
}) =>
<div>
  <div className="header">
    <Link className="logo" to="/">Apprentice Data Extractor</Link>

    <div className="menu">
      <a className="hvr-underline-from-right">About</a>
      <a className="hvr-underline-from-right">Pricing</a>
      { loggedIn ||
      <a
        className="hvr-underline-from-left"
        onClick={ () => dispatch(toggleModal(`AuthModal`)) }
      >
        Login / Register
      </a>
      }
      { loggedIn &&
      <div>
        <span>Welcome, { user.email }</span>
        <a onClick={ () => dispatch(logout()) }>Log out</a>
      </div>
      }
    </div>
  </div>
</div>

export default connect(
  state => ({
    ...state.auth,
  })
)(Home)
