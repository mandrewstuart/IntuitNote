import React from 'react'
import { connect } from 'react-redux'
import Sidebar from './Sidebar'

let Dashboard = ({
  children,
  message,
  subjects,
}) =>
  <div className="app dashboard">
    <Sidebar />

    <div className="main-area">
      { message === `No subject found!` ? message : children }
      { subjects.length }
    </div>
  </div>

export default connect(state => ({
  ...state.message,
  ...state.subjects,
}))(Dashboard)
