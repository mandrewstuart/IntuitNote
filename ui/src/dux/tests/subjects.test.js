import 'babel-polyfill'
import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { expect } from 'chai'

import * as actions from 'dux/subjects'
import reducers from 'dux'

let reducer = combineReducers(reducers)

describe(`Subjects`, () => {

  let store

  beforeEach(() =>
    store = createStore(reducer, applyMiddleware(thunk))
  )

  it(`should exist`, () => {
    let initialState = {
      subjects: [],
      subject: { name: `` },
    }

    expect(store.getState().subjects).to.deep.eq(initialState)
  })
})
