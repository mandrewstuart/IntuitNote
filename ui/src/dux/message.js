import * as auth from 'dux/auth'
import * as subjects from 'dux/subjects'
import * as documents from 'dux/documents'
import * as modal from 'dux/modal'

/*----------------------------------------------------------------------------*/

let intialState = { message: `` }

export default (state = intialState, action) => {

  switch (action.type) {

    case documents.INVALID_DOCUMENT:
    case subjects.SUBJECT_NOT_FOUND:
    case auth.LOGIN_FAIL:
      return {
        ...state,
        message: action.payload.message,
      }

    case subjects.INVALID_SUBJECT:
      return {
        ...state,
        message: `Please name your subject!`,
      }

    case auth.LOGIN_SUCCESS:
    case auth.LOGIN_SUCCESS:
    case subjects.CREATE_SUBJECT:
    case subjects.DELETE_SUBJECT:
    case subjects.GET_SUBJECT:
    case documents.CREATE_DOCUMENT:
    case documents.DELETE_DOCUMENT:
    case documents.CREATE_TAG:
    case modal.CLOSE_MODAL:
      return {
        ...state,
        message: ``,
      }

    default:
      return state
  }
}
