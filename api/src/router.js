import express from 'express'
import brain from '../config/domain'
import fetch from 'isomorphic-fetch'

import { auth } from './auth'

export default ({ app, io }) => {

  let api = express.Router()

  auth({ app, api })

  api.post(`/newSubject`, (req, res) => {
    let { userEmail, name } = req.body

    fetch(`${brain}/createSubject`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then(res => {
        if (res.status >= 400)
          throw new Error(`Bad response from server`)

        return res.json()
      })
      .then(data => {

        /*
         *  TODO: save subjectId to User object.
         */

         User.findOne({ userEmail }).then(user => {
           user.subjects = [
             ...user.subjects
           ]
           res.json({ subjectId: `blah` })
         })
      })
      .catch(error => res.json({ error: error.message }))
  })

  return api
}
