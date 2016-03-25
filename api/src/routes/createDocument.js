import fetch from 'isomorphic-fetch'
import chalk from 'chalk'
import brain from '../../config/domain'
import User from '../models/User'

export default ({ api }) =>
  api.post(`/createDocument`, (req, res) => {
    let { userEmail, id, title, author, publication, text } = req.body

    fetch(`${brain}/createDocument`, {
      method: `POST`,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, title, author, publication, text }),
    })
      .then(res => {
        if (res.status >= 400)
          throw new Error(`Bad response from server`)

        return res.json()
      })
      .then(response => {
        User.findOne({ email: userEmail }, (err, user) => {
          if (err) throw err

          let subject = user.subjects.find(x => x.id === id)
          subject.numDocuments += 1

          user.save((err, user) => {
            if (err) throw err

            console.log(chalk.cyan(`
              ${user.email} has added a document to ${subject.name}.
              Number of documents: ${subject.numDocuments}
            `))

            res.json({ id })
          })
        })
      })
      .catch(error => res.json({ error: error.message }))
  })
