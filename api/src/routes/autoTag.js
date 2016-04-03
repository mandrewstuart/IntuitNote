import fetch from 'isomorphic-fetch'
import brain from '../../config/domain'
// import User from '../models/User'

export default ({ api }) =>
  api.post(`/autoTag`, (req, res) => {
    let { id } = req.body

    fetch(`${brain}/autoTag`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(res => {
        if (res.status >= 400)
          throw new Error(`Bad response from server`)

        return res.json()
      })
      .then(data => {
          if (data.error) res.json({ message: data.error })
        // User.findOne({ email: userEmail }, (err, user) => {
        //   if (err) throw err
        //
        //   user.save((err, user) => {
        //     if (err) throw err
        //     res.json({ tag_id })
        //   })
        // })

        res.json({ data })
      })
      .catch(error => res.json({ error: error.message }))
  })
