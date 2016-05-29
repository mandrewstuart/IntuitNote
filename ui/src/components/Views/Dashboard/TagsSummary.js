import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'
import { getDocument, editDocument } from 'dux/documents'

let TagsSummary = ({
  dispatch,
  output,
}) =>
  <div className="documents-list">
    <h5>Tags Summary</h5>

    <div className="table-header">
      <div style={{ flex: 4 }}><a>Document Title</a></div> {/* MAKE LINK */}
      <div style={{ flex: 2 }}>Doc Author</div>
      <div style={{ flex: 2 }}>Doc Publication</div>
      <div style={{ flex: 2 }}>Doc Publication Date</div>
      <div style={{ flex: 2 }}>Sentence</div>
      <div style={{ flex: 2 }}>Tag</div>
    </div>

    <div>
      { output.map(row =>
        <div key={row.tag_ID} className="table-row">
          <div style={{ flex: 4 }}>{row.doc_name}</div>
          <div style={{ flex: 2 }}>--</div>
          <div style={{ flex: 2 }}>--</div>
          <div style={{ flex: 2 }}>--</div>
          <div style={{ flex: 2 }}>{row.sent_value}</div>
          <div style={{ flex: 2 }}>{row.tag_value}</div>
        </div>
      )}
    </div>
  </div>

export default connect(
  state => ({
    ...state.summary
  })
)(TagsSummary)
