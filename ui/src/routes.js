import React from 'react'
import { Router, Route } from 'react-router'
import { browserHistory } from 'react-router'

import App from 'components/App'
import Home from 'components/Home'
import Dashboard from 'components/Dashboard'
import auth from './auth'

let requireAuth = (nextState, replace) =>
    !auth.loggedIn() && replace('/')

export default
  <Router
    history = { browserHistory }
  >
    <Route
      component = { App }
    >
      <Route
        path = "/"
        component = { Home }
      />
      <Route
        path = "/dashboard"
        component = { Dashboard }
        onEnter = { requireAuth }
      />
    </Route>
  </Router>
