import Modals from 'components/Modals'

import { CREATE_SUBJECT, DELETE_SUBJECT } from 'dux/subjects'
import { CREATE_DOCUMENT, TAG_SENTENCE, CREATE_TAG } from 'dux/documents'
import { LOGIN_SUCCESS } from 'dux/auth'

export let OPEN_MODAL = `OPEN_MODAL`
export let CLOSE_MODAL = `CLOSE_MODAL`

export let toggleModal = modal => ({
  type: modal ? OPEN_MODAL : CLOSE_MODAL,
  payload: { ModalComponent: Modals[modal] },
})

/*----------------------------------------------------------------------------*/

let intialState = {
  ModalComponent: Modals.AuthModal,
  modalOpen: false,
}

export default (state = intialState, action) => {

  switch (action.type) {

    case OPEN_MODAL:
      return {
        ...state,
        modalOpen: true,
        ModalComponent: action.payload.ModalComponent,
      }

    case TAG_SENTENCE:
      return {
        ...state,
        modalOpen: true,
        ModalComponent: Modals.CreateTag,
      }

    case CREATE_SUBJECT:
    case DELETE_SUBJECT:
    case CREATE_DOCUMENT:
    case LOGIN_SUCCESS:
    case CREATE_TAG:
    case CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false,
      }

    default:
      return state
  }
}
