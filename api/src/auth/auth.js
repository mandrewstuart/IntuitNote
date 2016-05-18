import jwt from 'jsonwebtoken'
import User from '../models/User'

import crypto from 'crypto'

export default ({
  api,
  app,
}) => {
  let hashPassword = password =>
    crypto
      .createHmac(`sha256`, app.get(`superSecret`))
      .update(password)
      .digest(`hex`)

  let doubleHash = password => hashPassword(hashPassword(password))

  app.post(`/signup`, (req, res) => {

    let { email, password } = req.body

    if (email && password) {
      User.findOne({ email }, (err, user) => {
        if (err) throw err
        if (user) res.json({
          success: false,
          message: `User with this email already exists.`,
        })
        else {

          let user = new User({ email, password: doubleHash(password), plan: `free` })

          user.save((err, user) => {
            if (err) throw err
            res.json({ success: true, user })
          })
        }
      })
    } else res.json({
      success: false,
      message: `Must provide email and password.`,
    })
  })

  api.post(`/authenticate`, (req, res) => {

    let { email, password } = req.body

    User.findOne({ email }, (err, user) => {

      if (err) throw err

      if (!user) {
        res.json({ success: false, message: 'User not found.' })
      } else if (user) {

        // check if password matches
        if (user.password !== doubleHash(password)) {
          res.json({ success: false, message: 'Wrong password.' })
        } else {

          let token = jwt.sign(user, app.get('superSecret'), {
            expiresInMinutes: 1440, // expires in 24 hours
          })

          res.json({
            success: true,
            message: 'Enjoy your token!',
            token,
            user,
          })
        }
      }
    })
  })

  api.use((req, res, next) => {

    let token = req.body.token

    if (token) {
      jwt.verify(token, app.get(`superSecret`), (err, decoded) => {
        if (err) {
          return res.json({ success: false, message: 'Failed to authenticate token.' })
        } else {
          req.email = decoded._doc.email
          next()
        }
      })

    } else {

      return res.status(403).send({
        success: false,
        message: 'No token provided.',
      })
    }
  })
}
