import { domain } from 'config'

export default async ({ endpoint, body }) => {
  let response = await fetch(`${domain}:8080/api/${endpoint}`, {
    method: `POST`,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return response.json()
}
