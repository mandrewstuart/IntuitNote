import fetch from 'isomorphic-fetch'
import brain from '../../config/domain'
// import User from '../models/User'

export default ({ api }) =>
  api.post(`/autoTag`, (req, res) => {
    let { id } = req.body

    console.log('id is', id)

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
        // User.findOne({ email: userEmail }, (err, user) => {
        //   if (err) throw err
        //
        //   user.save((err, user) => {
        //     if (err) throw err
        //     res.json({ tag_id })
        //   })
        // })

        console.log(data)

        res.json({ data: 'heyhey' })
      })
      .catch(error => res.json({ error: error.message }))
  })
