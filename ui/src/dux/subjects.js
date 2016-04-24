import { push } from 'react-router-redux'
import api from 'utils/api'
import auth from '../auth'

import { LOGIN_SUCCESS } from 'dux/auth'

export let GET_SUBJECTS = `GET_SUBJECTS`
export let GET_SUBJECT = `GET_SUBJECT`
export let CREATE_SUBJECT = `CREATE_SUBJECT`
export let INVALID_SUBJECT = `INVALID_SUBJECT`
export let DELETE_SUBJECT = `DELETE_SUBJECT`
export let TOGGLE_SUBJECT_EDITING = `TOGGLE_SUBJECT_EDITING`

export let getSubjects = () =>
  async dispatch => {
    if (auth.loggedIn()) {
      let { subjects } = await api({ endpoint: `getSubjects` })
      dispatch({
        type: GET_SUBJECTS,
        payload: { subjects },
      })
    }
  }

export let getSubject = ({ id, redirect }) =>
  async dispatch => {
    let { documents } = await api({
      endpoint: `getSubject`,
      body: { id },
    })

    dispatch({
      type: GET_SUBJECT,
      payload: { id, documents },
    })

    if (redirect) dispatch(push(`/dashboard/subject/${id}`))
  }

export let createSubject = ({ name }) =>
  async dispatch => {
    if (!name) return dispatch({ type: INVALID_SUBJECT })

    let { id } = await api({
      endpoint: `createSubject`,
      body: { name },
    })

    console.log(`Subject created! ID: `, id)

    dispatch({
      type: CREATE_SUBJECT,
      payload: {
        subject: {
          name,
          id,
          active: true,
          createdDate: +new Date(),
          updatedDate: +new Date(),
        },
      },
    })

    dispatch(push(`/dashboard/subject/${id}`))
  }

export let deleteSubject = ({ id }) =>
  async dispatch => {
    await api({
      endpoint: `deleteSubject`,
      body: { id },
    })

    dispatch({
      type: DELETE_SUBJECT,
      payload: { id },
    })
  }

export let toggleSubjectEditing = ({ id, name }) =>
  async dispatch => {
    if (this.state.editingSubject) {
      let data = await api({
        endpoint: `updateSubject`,
        body: { id, name },
      })
      let { subjects } = this.state
      subjects.find(x => x.id === id).name = name
      this.setState({ subjects })
    }
    this.setState({ editingSubject: !this.state.editingSubject })
  }

/*----------------------------------------------------------------------------*/

let intialState = { subjects: [] }

export default (state = intialState, action) => {

  switch (action.type) {

    case LOGIN_SUCCESS:
    case GET_SUBJECTS:
      return {
        ...state,
        subjects: action.payload.subjects,
      }

    case GET_SUBJECT:
      return {
        ...state,
        subjects: state.subjects.map(s => ({
          ...s,
          active: s.id === action.payload.id,
        })),
      }

    case CREATE_SUBJECT:
      return {
        ...state,
        subjects: [
          ...state.subjects.map(s => ({ ...s, active: false })),
          action.payload.subject,
        ],
      }

    case DELETE_SUBJECT:
      return {
        ...state,
        subjects: state.subjects.filter(s => s.id !== action.payload.id),
      }

    default:
      return state
  }
}
