export let OPEN_POPOVER = `OPEN_POPOVER`
export let CLOSE_POPOVER = `CLOSE_POPOVER`

export let togglePopover = ({ popoverId, popoverContent } = {}) => ({
  type: popoverId ? OPEN_POPOVER : CLOSE_POPOVER,
  payload: { popoverId, popoverContent },
})

/*----------------------------------------------------------------------------*/

let intialState = {
  popoverId: null,
  popoverContent: ``,
}

export default (state = intialState, action) => {

  switch (action.type) {

    case OPEN_POPOVER:
      return {
        ...state,
        popoverId: action.payload.popoverId,
        popoverContent: action.payload.popoverContent,
      }

    case CLOSE_POPOVER:
      return intialState

    default:
      return state
  }
}
