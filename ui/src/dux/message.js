import { LOGIN_FAIL, LOGIN_SUCCESS } from 'dux/auth'
import { INVALID_SUBJECT } from 'dux/subjects'

/*----------------------------------------------------------------------------*/

let intialState = { message: `` }

export default (state = intialState, action) => {

  switch (action.type) {

    case LOGIN_FAIL:
      return {
        ...state,
        message: action.payload.message,
      }

    case INVALID_SUBJECT:
      return {
        ...state,
        message: `Please name your subject!`,
      }

    case LOGIN_SUCCESS:
      return {
        ...state,
        message: ``,
      }

    default:
      return state
  }
}
