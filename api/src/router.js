import express from 'express'
import { auth } from './auth'

import {
  getSubjects,
  createSubject,
  getSubject,
  deleteSubject,
  updateSubject,
  createDocument,
  getDocument,
  createTag,
} from './routes'


export default ({ app }) => {

  let api = express.Router()

  auth({ app, api })
  getSubjects({ api })
  createSubject({ api })
  getSubject({ api })
  deleteSubject({ api })
  updateSubject({ api })
  createDocument({ api })
  getDocument({ api })
  createTag({ api })

  return api
}
