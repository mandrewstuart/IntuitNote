import { LOGIN_FAIL } from 'dux/auth'
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

    default:
      return state
  }
}
