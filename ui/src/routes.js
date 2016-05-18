import React from 'react'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

/*----------------------------------------------------------------------------*/

import App from 'components/App'
import Home from 'components/Views/Home'
import Dashboard from 'components/Views/Dashboard'
import Subject from 'components/Views/Dashboard/Subject'
import Document from 'components/Views/Dashboard/Document'
import DocumentsList from 'components/Views/Dashboard/DocumentsList'
import reducers from 'dux'
import auth from './auth'

let store = createStore(
  combineReducers({
    ...reducers,
    routing: routerReducer,
  }),
  applyMiddleware(
    routerMiddleware(browserHistory),
    thunk
  )
)

let history = syncHistoryWithStore(browserHistory, store)

let requireAuth = (nextState, replace) => !auth.loggedIn() && replace(`/`)

export default
  <MuiThemeProvider muiTheme={ getMuiTheme() }>
    <Provider store={ store }>
      <Router history={ history }>
        <Route component={ App }>
          <Route path="/" component={ Home } />
          <Route path="/dashboard" component={ Dashboard } onEnter={ requireAuth }>
            <Route path="subject/:subject" component={ Subject }>
              <IndexRoute component={ DocumentsList } />
              <Route path="document/:document" component={ Document } />
            </Route>
          </Route>
        </Route>
      </Router>
    </Provider>
  </MuiThemeProvider>
