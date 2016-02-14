import 'babel-polyfill'

/*----------------------------------------------------------------------------*/

import React from 'react'
import { render } from 'react-dom'
import { Router, Route } from 'react-router'
import { browserHistory } from 'react-router'
/*----------------------------------------------------------------------------*/

import App from 'components/App'
import Login from 'components/Login'
import Home from 'components/Home'
import auth from './auth'

/*----------------------------------------------------------------------------*/

let requireAuth = auth =>
  (nextState, replace) =>
    !auth.loggedIn() && replace('/login')

let routes =
  <Router
    history = { browserHistory }
  >
    <Route
      component = { App }
    >
      <Route
        path = "/"
        component = { Home }
        onEnter = { requireAuth(auth) }
      />
      <Route
        path = "/login"
        component = { Login }
      />
    </Route>
  </Router>

/*----------------------------------------------------------------------------*/

render(routes, document.getElementById(`app`))
