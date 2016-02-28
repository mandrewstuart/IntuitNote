import express from 'express'
import fetch from 'isomorphic-fetch'
import brain from '../config/domain'
import User from './models/User'

import { auth } from './auth'

export default ({ app, io }) => {

  let api = express.Router()

  auth({ app, api })

  api.post(`/getSubjects`, (req, res) => {
    let { userEmail } = req.body
    User.findOne({ email: userEmail }, (err, user) => {
      if (err) throw err
      res.json({ subjects: user.subjects })
    })
  })

  api.post(`/createSubject`, (req, res) => {
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
      .then(({ id }) => {
        User.findOne({ email: userEmail }, (err, user) => {
          if (err) throw err

          user.subjects = [ ...user.subjects, { name, id } ]

          user.save((err, user) => {
            if (err) throw err
            res.json({ id })
          })
        })
      })
      .catch(error => res.json({ error: error.message }))
  })

  api.post(`/getSubject`, (req, res) => {
    let { userEmail, id } = req.body

    fetch(`${brain}/getSubject`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => {
        if (res.status >= 400)
          throw new Error(`Bad response from server`)

        return res.json()
      })
      .then(({ documents }) => res.json({ documents }) )
      .catch(error => res.json({ error: error.message }))
  })

  return api
}
