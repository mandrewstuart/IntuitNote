import { push } from 'react-router-redux'
import auth from '../auth'
import isAValidEmail from 'utils/isEmail'

export let LOGIN_SUCCESS = `LOGIN_SUCCESS`
export let LOGIN_FAIL = `LOGIN_FAIL`
export let LOGOUT = `LOGOUT`

export let login = (type, { email, password }) =>
  dispatch => {
    if (!isAValidEmail(email)) {
      dispatch({
        type: LOGIN_FAIL,
        payload: { message: `Invalid email` },
      })
      return
    }

    auth[type]({ email, password }, response => {
      if (response.success) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {
            loggedIn: response.success,
            user: response.user,
            subjects: response.user.subjects,
          },
        })

        dispatch(push(`/dashboard`))
      }

      else dispatch({
        type: LOGIN_FAIL,
        payload: { message: response.message },
      })
    })
  }


export let logout = () =>
  dispatch => {
    localStorage.clear()
    dispatch(push(`/`))

    // TODO : reset all the things!

    dispatch({
      type: LOGOUT,
      payload: { loggedIn: false },
    })
  }

/*----------------------------------------------------------------------------*/

let intialState = {
  loggedIn: auth.loggedIn(),
  user: { email: localStorage.userEmail },
}

export default (state = intialState, action) => {

  switch (action.type) {

    case LOGIN_SUCCESS:
      return {
        ...state,
        loggedIn: action.payload.loggedIn,
        user: action.payload.user,
      }

    case LOGOUT:
      return {
        loggedIn: false,
      }

    default:
      return state
  }
}
