import api from 'utils/api'

import { GET_SUBJECT, CREATE_SUBJECT } from 'dux/subjects'

export let GET_DOCUMENT = `GET_DOCUMENT`
export let CREATE_DOCUMENT = `CREATE_DOCUMENT`
export let DELETE_DOCUMENT = `DELETE_DOCUMENT`

export let getDocument = ({ id }) =>
  async dispatch => {
    let { document } = await api({
      endpoint: `getDocument`,
      body: { id },
    })

    dispatch({
      type: GET_DOCUMENT,
      payload: { document },
    })
  }

export let createDocument = ({ title, author, text, publication, id }) =>
  async dispatch => {

    let { document_ID } = await api({
      endpoint: `createDocument`,
      body: { title, author, text, publication, id },
    })

    dispatch({
      type: CREATE_DOCUMENT,
      payload: {
        document: { name: title, author, text, publication, id: document_ID },
      },
    })
  }

/*----------------------------------------------------------------------------*/

let intialState = { documents: [] }

export default (state = intialState, action) => {

  switch (action.type) {

    case CREATE_DOCUMENT:
      return {
        ...state,
        documents: [
          ...state.documents,
          action.payload.document,
        ],
      }

    case GET_SUBJECT:
      return {
        ...state,
        documents: action.payload.documents,
      }

    case CREATE_SUBJECT:
      return {
        ...state,
        documents: intialState.documents,
      }

    case DELETE_DOCUMENT:
    case GET_DOCUMENT:
    default:
      return state
  }

}
