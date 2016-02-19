import express from 'express'

import { auth } from './auth'

export default ({ app, io }) => {

  let api = express.Router()

  auth({ app, api })

  api.post(`/newSubject`, (req, res) => {
    let { userEmail, title } = req.body
    res.json({ subjectId: 'blah' })
  })

  return api
}
