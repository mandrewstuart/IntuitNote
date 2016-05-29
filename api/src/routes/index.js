import proxy from './proxy'

/*
 *  Subjects
 */

import getSubjects from './getSubjects'
import createSubject from './createSubject'
import getSubject from './getSubject'
import deleteSubject from './deleteSubject'
import updateSubject from './updateSubject'

/*
 *  Documents
 */

import createDocument from './createDocument'
import deleteDocument from './deleteDocument'
import getDocument from './getDocument'

/*
 *  Tags
 */

import createTag from './createTag'
import autoTag from './autoTag'

export {
  getSubjects,
  createSubject,
  getSubject,
  deleteSubject,
  updateSubject,
  createDocument,
  deleteDocument,
  getDocument,
  createTag,
  autoTag,
  proxy,
}
