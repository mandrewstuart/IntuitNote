import express from 'express'

import { auth } from './auth'

export default ({ app, io }) => {

  let apiRoutes = express.Router()

  auth({ app, apiRoutes })

  return apiRoutes
}
