import fetch from 'isomorphic-fetch'

export default async body => {
  let response = await fetch(`${API_URL}/api/proxy`, {
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
