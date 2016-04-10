import React from 'react'
import { connect } from 'react-redux'
import { tagSentence, autoTag } from 'dux/documents'

let Document = ({
  documents,
  dispatch,
}) =>
  <div>
    { !!documents.length && documents.some(d => d.active) &&
      documents.filter(d => d.active).map(d =>
        <div key={ d.id || d.doc_id }>
          <div style={{ display: `flex`, alignItems: `center` }}>
            <div className="document-title">{ d.name || d.doc_name }</div>

            <button
              style={{ margin: `0.7rem 0.7rem 0.7rem auto`, width: `9rem`, color: `rgb(50, 117, 232)` }}
              onClick={ () => dispatch(autoTag({ id: d.doc_id })) }
            >
              AUTO TAG
              <i className="fa fa-magic" />
            </button>
          </div>

          <div>
            <div>
              { d.sentences.map(s =>
                <span
                  key={ s.id }
                  onClick={ () => dispatch(tagSentence({ sentence: s })) }
                  className={ `sentence ${ s.tag_value ? `tagged` : `` }` }
                >
                  { s.value }
                  {/*{ s.tag_value &&
                    <Tooltip show label={ s.tag_value } />
                  }*/}
                </span>
              )}
            </div>
          </div>
        </div>
      )
    }
  </div>

export default connect(
  state => ({
    ...state.documents,
  })
)(Document)
