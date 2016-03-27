import fetch from 'isomorphic-fetch'
import brain from '../../config/domain'
import User from '../models/User'

export default ({ api }) =>
  api.post(`/createTag`, (req, res) => {
    let { id, value } = req.body

    fetch(`${brain}/createTag`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, value }),
    })
      .then(res => {
        if (res.status >= 400)
          throw new Error(`Bad response from server`)

        return res.json()
      })
      .then(({ tag_id }) => {
        User.findOne({ email: userEmail }, (err, user) => {
          if (err) throw err

          // user.subjects = [ ...user.subjects, { name, id, numDocuments: 0 } ]

          user.save((err, user) => {
            if (err) throw err
            res.json({ tag_id })
          })
        })
      })
      .catch(error => res.json({ error: error.message }))
  })
