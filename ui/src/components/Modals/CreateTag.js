import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'
import { createTag } from 'dux/documents'

let tag

let CreateTag = ({
  message,
  sentenceBeingTagged,
  dispatch,
}) =>
  <div className={ `modal-content ${ sentenceBeingTagged.tag_value ? `editing` : `` }` }>
    <div className="modal-title">
      { sentenceBeingTagged.tag_value ? `Edit Tag` : `Create Tag` }
    </div>

    <div className="new-subject form">
      <p>{ sentenceBeingTagged.value }</p>

      <div style={{ marginTop: `1rem`, width: `100%` }}>
        <textarea
          style={{ width: `100%` }}
          ref = { node => tag = node }
          placeholder="Tag.."
          defaultValue={ sentenceBeingTagged.tag_value }
        />
      </div>

      <div className="button-row">
        <button className="delete" onClick={ () =>
          dispatch(createTag({ id: sentenceBeingTagged.id, value: tag.value }))
        }>
          SAVE
        </button>

        <button onClick={ () => dispatch(toggleModal()) }>CANCEL</button>
      </div>

      <div className="error">{ message }</div>
    </div>
  </div>

export default connect(
  state => ({
    ...state.message,
    ...state.documents,
  })
)(CreateTag)
