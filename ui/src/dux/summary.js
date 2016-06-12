import * as subjects from 'dux/subjects'

let intialState = { output: [] }

export default (state = intialState, action) => {
  switch (action.type) {
    case subjects.GET_SUMMARY:
      return action.payload

    case subjects.CREATE_SUBJECT:
      return intialState

    default:
      return state

  }
}
