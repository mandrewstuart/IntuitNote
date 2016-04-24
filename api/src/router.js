import express from 'express'
import { auth } from './auth'

import * as routes from './routes'


export default ({ app }) => {

  let api = express.Router()

  auth({ app, api })

  Object.keys(routes).forEach(key => routes[key]({ api }))

  return api
}
