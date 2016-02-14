import React, { Component, Children, cloneElement, PropTypes } from 'react'
import { Link } from 'react-router'

/*----------------------------------------------------------------------------*/

import auth from '../auth'
import { domain } from 'config'
import io from 'socket.io-client'

/*----------------------------------------------------------------------------*/

let socket = io(`${domain}:8080`)

export default class App extends Component {
  static contextTypes = { history: PropTypes.object };

  constructor (props) {
    super(props)
    this.state = {
      loggedIn: auth.loggedIn(),
      user: { email: localStorage.userEmail },
    }
  }

  login = (type, { email, password }) => {
    auth[type]({ email, password }, response => {
      if (response.success) {
        this.setState({
          loggedIn: response.success,
          user: response.user,
        })

        let nextPathname = this.props.location.state
          ? this.props.location.state.nextPathname
          : `/`

        this.context.history.pushState(null, nextPathname)
      } else {
        this.setState({
          message: response.message,
        })
      }
    })
  };

  logout = () => {
    localStorage.clear()
    this.context.history.pushState(null, `/login`)
    this.setState({ loggedIn: false, headerColor: `rgb(27, 173, 112)` })
  };

  render() {
    let children = Children.map(this.props.children, child => {
      return cloneElement(child, {
        ...child.props,
        ...this.props,
        ...this.state,
        setAuth: this.setAuth,
        login: this.login,
        socket,
      })
    })

    return (
      <div>
        <div className = "z-depth-2">
          <Link to = "/">ADE</Link>

          { this.state.loggedIn &&
          <div>
            <span>Welcome, { this.state.user.email }</span>
            <a onClick = { this.logout }>Log out</a>
          </div>
          }
        </div>
        
        { children }
      </div>
    )
  }
}
