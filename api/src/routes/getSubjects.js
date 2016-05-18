import User from '../models/User'

export default ({ api }) =>
  api.post(`/getSubjects`, (req, res) => {
    User.findOne({ email: req.email }, (err, user) => {
      if (err) res.json({ err })
      if (user)
        res.json({ subjects: user.subjects, success: true })
      else
        res.json({ message: `No user found` })
    })
  })
