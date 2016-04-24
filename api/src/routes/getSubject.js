import fetch from 'isomorphic-fetch'
import User from '../models/User'
import brain from '../../config/domain'

export default ({ api }) =>
  api.post(`/getSubject`, (req, res) => {
    let { id, userEmail } = req.body

    User.findOne({ email: userEmail }, (err, user) => {
      if (err) throw err
      if (user) {

        if (user.subjects.find(x => x.id === id)) {
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
        }
        else res.json({ message: `No subject with that id.` })
      }
      else res.json({ message: `` })
    })
  })
