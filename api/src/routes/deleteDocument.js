import fetch from 'isomorphic-fetch'
import User from '../models/User'
import brain from '../../config/domain'

export default ({ api }) =>
  api.post(`/deleteDocument`, (req, res) => {
    let { docId, subjId, userEmail } = req.body

    User.findOne({ email: userEmail }, (err, user) => {
      if (err) throw err

      if (user) {

        fetch(`${brain}/deleteDocument`, {
          method: `POST`,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: docId }),
        })
          .then(res => {
            if (res.status >= 400)
              throw new Error(`Bad response from server`)

            return res.json()
          })
          .then(() => {
            res.json({ message: `Document deleted!` })
          })
          .catch(error => res.json({ error: error.message }))
      }

      else res.json({ message: `User not found.` })
    })
  })
