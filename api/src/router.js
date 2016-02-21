import express from 'express'
import brain from '../config/domain'
import fetch from 'isomorphic-fetch'

import { auth } from './auth'

export default ({ app, io }) => {

  let api = express.Router()

  auth({ app, api })

  api.post(`/newSubject`, (req, res) => {
    let { userEmail, title } = req.body

    fetch(`${brain}/subject/create`, {

    }).then(res => {
      if (res.status >= 400) {
        throw new Error(`Bad response from server`)
      }
      return res.json()
    }).then(data => {
      res.json({ subjectId: `blah` })
    })
    .catch(error => res.json({ error }))
  })

  return api
}
