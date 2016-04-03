import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'
import { getDocument } from 'dux/documents'

let DocumentsList = ({
  dispatch,
  documents,
}) =>
  <div>
    <div className="table-header">
      <div style={{ flex: 8 }}>Title</div>
      <div>Delete</div>
    </div>

    <div>
      { documents.map(d =>
        // TODO: unify document id -> id
        <div key={ d.id || d.doc_id } className="table-row">
          <a
            style={{ flex: 8 }}
            onClick={ () => dispatch(getDocument({ id: d.id })) }
          >
            {/* TODO: unify document name -> title */}
            { d.name || d.doc_name }
          </a>

          <a
            style={{ color: `rgb(147, 31, 11)` }}
            onClick={ () => dispatch(toggleModal(`Confirm`)) }
          >
            <i className="fa fa-trash-o" />
          </a>
        </div>
      )}
    </div>
  </div>

export default connect(
  state => ({
    ...state.documents,
  })
)(DocumentsList)