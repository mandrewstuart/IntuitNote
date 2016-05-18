import { domain } from 'config'
import fetch from 'isomorphic-fetch'

export default async ({ endpoint, body }) => {
  let response = await fetch(`${domain}:8080/api/${endpoint}`, {
    method: `POST`,
    headers: { 'Content-Type': `application/json` },
    body: JSON.stringify({
      token: localStorage.token,
      userEmail: localStorage.userEmail,
      _id: localStorage.userId,
      ...body,
    }),
  })
  return response.json()
}
