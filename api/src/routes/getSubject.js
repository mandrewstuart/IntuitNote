import fetch from 'isomorphic-fetch'
import brain from '../../config/domain'

export default ({ api }) =>
  api.post(`/getSubject`, (req, res) => {
    let { userEmail, id } = req.body

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
  })