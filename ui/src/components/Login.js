import React from 'react'

let email, password

export default function Login ({
  login,
  message,
}) {
  return (
    <div>
      <div>
        <input
          ref = { node => email = node }
          placeholder = "Email.."
          type = "text"
        />
        <input
          ref = { node => password = node }
          placeholder = "Password.."
          type = "password"
        />
        <button
          onClick = {
            () => {
              login(`login`, { email: email.value, password: password.value })
            }
          }
        >
          Log In
        </button>
        <button
          onClick = {
            () => {
              login(`signup`, { email: email.value, password: password.value })
            }
          }
        >
          Sign Up
        </button>
        { !!message &&
        <div>{ message }</div>
        }
      </div>
    </div>
  )
}
