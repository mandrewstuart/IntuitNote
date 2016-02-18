import React from 'react'

let email, password

export default ({
  login,
  closeModal,
  message,
}) =>
  <div className="auth modal-content">
    <div className="close-btn" onClick={ closeModal }>CLOSE ✕</div>
    <div className="login-form"
      style={{
        display: `flex`,
        flexDirection: `column`,
        justifyContent: `center`,
        alignItems: `center,`,
      }}
    >
      <input ref={ node => email = node } type="text" placeholder="E-mail address.." />
      <input ref={ node => password = node } type="password" placeholder="Password.." />

      <div className="button-row">
        <button className="login-btn"
          onClick={
            () => {
              login(`login`, { email: email.value, password: password.value })
            }
          }
        >
          Log In
        </button>
        <button className="register-btn"
          onClick={
            () => {
              login(`signup`, { email: email.value, password: password.value })
            }
          }
        >
          Register
        </button>
      </div>
      <div className="error">{ message }</div>
    </div>
  </div>
