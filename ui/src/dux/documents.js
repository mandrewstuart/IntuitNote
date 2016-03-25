export let GET_DOCUMENT = `GET_DOCUMENT`
export let CREATE_DOCUMENT = `CREATE_DOCUMENT`
export let DELETE_DOCUMENT = `DELETE_DOCUMENT`

export let getDocument = ({ id }) =>
  async dispatch => {
    let data = await api({
      endpoint: `getDocument`,
      body: { id },
    })

    console.log(data)

    dispatch({
      type: GET_DOCUMENT,
      payload: { data },
    })
  }

export let createDocument = ({ title, author, text, publication, id }) =>
  async dispatch => {
    let data = await api({
      endpoint: `createDocument`,
      body: { title, author, text, publication, id },
    })

    dispatch({
      type: CREATE_DOCUMENT,
    })
  }
