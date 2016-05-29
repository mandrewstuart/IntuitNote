import * as subjects from 'dux/subjects'

let intialState = { output: [] }

export default (state = intialState, action) => {
  switch (action.type) {
    case subjects.GET_SUMMARY:
      console.log('...', action.payload)
      return action.payload

    default:
      console.log(state)
      return state

  }
}
