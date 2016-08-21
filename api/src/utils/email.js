import fetch from 'isomorphic-fetch'
import { clientURL } from '../../config/domain'
import { sendInBlueApi, sendInBlueKey } from '../../config/email'

let api = async ({ endpoint, method, body }) => {
  console.log('>>>', body)
  let response = await fetch(`${sendInBlueApi}/${endpoint}`, {
    method,
    headers: {
      'api-key': sendInBlueKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  let data = await response.json()

  console.log('>>>', data)
}

let sendEmail = ({
  // template,
  to,
  // attr
}) => {
  return api({
    // endpoint: `template/${template}`,
    endpoint: `email`,
    method: `POST`,
    body: {
      to: { [to]: to },
      subject: `Welcome to IntuitNote!`,
      from: [ `intuitnote@gmail.com`, `IntuitNote Concierge` ],
      html: "Welcome to IntuiNote!",
    },
    // body: { to, attr },
  })
}

export let createEmailContact = ({ email, username, userId }) => {
  return api({
    endpoint: `/user/createdituser`,
    method: `POST`,
    body: {
      email,
      attributes: {
        USERNAME: username,
        USER_ID: userId,
      },
    },
  })
}

export let sendPasswordResetEmail = ({ username, email, resetToken }) => {
  let resetLink = `${clientURL}/new-password?token=${resetToken}&email=${email}`
  return sendEmail(1, email, { USERNAME: username, RESETLINK: resetLink })
}

export let sendWelcomeEmail = ({ email }) => {
  // let confirmLink = `${clientURL}/confirm-user?token=${confirmToken}&email=${email}`
  return sendEmail({ template: 1, to: email })
  //   {
  //   USERNAME: username,
  //   CONFIRMLINK: confirmLink,
  //   CONFIRMTOKEN: confirmToken,
  // }
  // )
}
