import { LOGIN_FAIL, LOGIN_SUCCESS } from 'dux/auth'
import { INVALID_SUBJECT, SUBJECT_NOT_FOUND, GET_SUBJECT } from 'dux/subjects'

/*----------------------------------------------------------------------------*/

let intialState = { message: `` }

export default (state = intialState, action) => {

  switch (action.type) {

    case SUBJECT_NOT_FOUND:
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

    case GET_SUBJECT:
    case LOGIN_SUCCESS:
      return {
        ...state,
        message: ``,
      }

    default:
      return state
  }
}
