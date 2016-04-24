import User from '../models/User'

export default ({ api }) =>
  api.post(`/getSubjects`, (req, res) => {
    let { userEmail } = req.body
    User.findOne({ email: userEmail }, (err, user) => {
      if (err) throw err
      if (user)
        res.json({ subjects: user.subjects })
      else
        res.json({ message: `No user found` })
    })
  })
