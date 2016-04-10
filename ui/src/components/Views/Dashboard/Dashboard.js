import React from 'react'
import Sidebar from './Sidebar'

let Dashboard = ({
  children,
}) =>
  <div className="app dashboard">
    <Sidebar />

    <div className="main-area">
      { children }
    </div>
  </div>

export default Dashboard
