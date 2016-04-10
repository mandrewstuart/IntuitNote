import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'
import { login } from 'dux/auth'

let email, password

let AuthModal = ({
  dispatch,
  message,
}) =>
  <div className="auth modal-content">
    <div className="close-btn" onClick={ () => dispatch(toggleModal()) }>CLOSE ✕</div>
    <div className="login form">
      <input ref={ node => email = node } type="text" placeholder="E-mail address.." />
      <input ref={ node => password = node } type="password" placeholder="Password.." />

      <div className="button-row">
        <button className="login-btn"
          onClick={
            () => {
              dispatch(login(`login`, { email: email.value, password: password.value }))
            }
          }
        >
          LOGIN
        </button>
        <button className="register-btn"
          onClick={
            () => {
              dispatch(login(`signup`, { email: email.value, password: password.value }))
            }
          }
        >
          SIGN UP
        </button>
      </div>
      <div className="error">{ message }</div>
    </div>
  </div>

export default connect(
  state => ({
    ...state.message,
  })
)(AuthModal)
