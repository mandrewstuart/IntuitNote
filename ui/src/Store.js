import React, { Component } from 'react'
import { observable } from 'mobx'
import Modals from 'components/Modals'
import auth from './auth'

export default class {
  @observable ModalComponent = Modals[`AuthModal`]
  @observable modalOpen = false
  @observable loggedIn = auth.loggedIn()
  @observable user = { email: localStorage.userEmail }
  @observable subjects = []
  @observable editingSubject = false
}

export let connect = Store => Composed =>
  class extends Component {
    render() {
      return <Composed { ...this.props } $ = { new Store() } />
    }
  }
