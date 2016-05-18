import fetch from 'isomorphic-fetch'
import brain from '../../config/domain'

export default ({ api }) =>
  api.post(`/updateSubject`, (req, res) => {
    let { id, name } = req.body

    User.findOne({ email: req.email }, (err, user) => {
      if (err) res.json({ err })

      fetch(`${brain}/updateSubject`, {
        method: `POST`,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, name }),
      })
        .then(res => {
          if (res.status >= 400)
            throw new Error(`Bad response from server`)

          return res.json()
        })
        .then(() => {
          user.subjects = user.subjects.find(x => x.id === id).name = name

          user.save(err => {
            if (err) throw err
            res.json({ message: `Subject updated.` })
          })
        })
        .catch(error => res.json({ error: error.message }))
    })
  })
