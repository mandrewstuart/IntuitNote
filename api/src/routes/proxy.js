import fetch from 'isomorphic-fetch'
import brain from '../../config/domain'
import User from '../models/User'

export default ({ api }) =>
  api.post(`/proxy`, (req, res) => {
    let { userEmail, name, endpoint } = req.body

    User.findOne({ email: req.email }, (err, user) => {

      if (user) {

        fetch(`${brain}/${endpoint}`, {
          method: `POST`,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(req.body),
        })
          .then(res => {
            if (res.status >= 400)
              throw new Error(`Bad response from server`)

            return res.json()
          })
          .then(data => {
              if (err) throw err
              res.json(data)
          })
          .catch(error => res.json({ error: error.message }))

      }
    })
  })
