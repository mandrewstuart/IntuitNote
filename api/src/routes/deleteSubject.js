import fetch from 'isomorphic-fetch'
import brain from '../../config/domain'

export default ({ api }) =>
  api.post(`/deleteSubject`, (req, res) => {
    let { id, userEmail } = req.body

    fetch(`${brain}/deleteSubject`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => {
        if (res.status >= 400)
          throw new Error(`Bad response from server`)

        return res.json()
      })
      .then(() => {
        User.findOne({ email: userEmail }, (err, user) => {
          if (err) throw err

          user.subjects = user.subjects.filter(x => x.id !== id)

          user.save((err, user) => {
            if (err) throw err
            res.json({ message: `Subject deleted.` })
          })
        })
      })
      .catch(error => res.json({ error: error.message }))
  })
