import chalk from 'chalk'
import fetch from 'isomorphic-fetch'
import { clientURL } from '../../config/domain'
import { sendInBlueApi, sendInBlueKey } from '../../config/email'

let api = async ({ endpoint, method, body }) => {
  let response = await fetch(`${sendInBlueApi}/${endpoint}`, {
    method,
    headers: {
      'api-key': sendInBlueKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  let data = await response.json()

  console.log(chalk.cyan(
    `Sendinblue response:

        ${data}

    `
  ))
}

let sendEmail = ({
  to,
  // attr
}) => {
  return api({
    endpoint: `email`,
    method: `POST`,
    body: {
      to: { [to]: to },
      subject: `Welcome to IntuitNote!`,
      from: [ `intuitnote@gmail.com`, `IntuitNote Concierge` ],
      html:
        `Welcome to IntuitNote!`,
    },
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
  let confirmLink = `${clientURL}/confirm-user?token=${confirmToken}&email=${email}`
  return sendEmail({
    to: email, 
    CONFIRMLINK: confirmLink,
    CONFIRMTOKEN: confirmToken,
  })
}
