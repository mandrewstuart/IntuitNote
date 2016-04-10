import { push } from 'react-router-redux'
import api from 'utils/api'

import { GET_SUBJECT, CREATE_SUBJECT } from 'dux/subjects'

export let GET_DOCUMENT = `GET_DOCUMENT`
export let CREATE_DOCUMENT = `CREATE_DOCUMENT`
export let DELETE_DOCUMENT = `DELETE_DOCUMENT`
export let TAG_SENTENCE = `TAG_SENTENCE`
export let CREATE_TAG = `CREATE_TAG`
export let AUTOTAG = `AUTOTAG`

export let getDocument = ({ id, subjectId }) =>
  async dispatch => {
    let { document } = await api({
      endpoint: `getDocument`,
      body: { id },
    })

    dispatch({
      type: GET_DOCUMENT,
      payload: { document, id },
    })

    dispatch(push(`/dashboard/subject/${subjectId}/document/${id}`))
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

export let tagSentence = ({ sentence }) => ({
  type: TAG_SENTENCE,
  payload: { sentence },
})

export let createTag = ({ id, value }) =>
  async dispatch => {
    let { tag_id } = await api({
      endpoint: `createTag`,
      body: { id, value },
    })

    dispatch({
      type: CREATE_TAG,
      payload: { tag_id },
    })

    /*
     *  TODO: get this information from the server
     */

    dispatch(getDocument({
      id: location.pathname.split(`/`).pop(),
      subjectId: location.pathname.split(`/`)[location.pathname.split(`/`).length - 3],
    }))
  }

export let autoTag = ({ id }) =>
  async dispatch => {
    let { suggestedTags, message } = await api({
      endpoint: `autoTag`,
      body: { id },
    })

    if (!message) {
      dispatch({
        type: AUTOTAG,
        payload: { suggestedTags },
      })
    }
  }

/*----------------------------------------------------------------------------*/

let intialState = {
  documents: [],
  document: {
    sentences: [],
  },
  sentenceBeingTagged: {},
  suggestedTags: [],
}

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

    case GET_DOCUMENT:
      return {
        ...state,
        document: action.payload.document,
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

    case TAG_SENTENCE:
      return {
        ...state,
        sentenceBeingTagged: action.payload.sentence,
      }

    case AUTOTAG:
      return {
        ...state,
        suggestedTags: action.payload.suggestedTags,
      }

    case DELETE_DOCUMENT:
    default:
      return state
  }

}
