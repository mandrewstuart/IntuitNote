import express from 'express'
import { auth } from './auth'

import {
  getSubjects,
  createSubject,
  getSubject,
  deleteSubject,
  updateSubject
} from './routes'

export default ({ app, io }) => {

  let api = express.Router()

  auth({ app, api })
  getSubjects({ api })
  createSubject({ api })
  getSubject({ api })
  deleteSubject({ api })
  updateSubject({ api })

  return api
}
