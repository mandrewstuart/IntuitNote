import Modals from 'components/Modals'

import { CREATE_SUBJECT } from 'dux/subjects'
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

    case CREATE_SUBJECT:
    case LOGIN_SUCCESS:
    case CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false,
      }

    default:
      return state
  }
}
