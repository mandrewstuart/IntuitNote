import React, { Component } from 'react'
import { Link } from 'react-router'

export default class Home extends Component {
  render () {
    return (
      <div>
        <div className = "header z-depth-2">
          <Link className = "logo" to = "/">Apprentice Data Extractor</Link>

          <div className = "menu">
            { this.props.loggedIn ||
            <a onClick = { this.props.openAuthModal }>Login / Register</a>
            }
            { this.props.loggedIn &&
            <div>
              <span>Welcome, { this.props.user.email }</span>
              <a onClick = { this.props.logout }>Log out</a>
            </div>
            }
          </div>
        </div>
      </div>
    )
  }
}
