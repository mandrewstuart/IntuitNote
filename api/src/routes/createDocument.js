import fetch from 'isomorphic-fetch'
import brain from '../../config/domain'
import User from '../models/User'

export default ({ api }) =>
  api.post(`/createDocument`, (req, res) => {
    let { userEmail, id, title, author, publication, text } = req.body

    fetch(`${brain}/createDocument`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, author, publication, text }),
    })
      .then(res => {
        if (res.status >= 400)
          throw new Error(`Bad response from server`)

        return res.json()
      })
      .then(({ id }) => {
        User.findOne({ email: userEmail }, (err, user) => {
          if (err) throw err

          user.subjects = user.subjects.find(x => x.id === id).numDocuments += 1

          user.save((err, user) => {
            if (err) throw err
            res.json({ id })
          })
        })
      })
      .catch(error => res.json({ error: error.message }))
  })
