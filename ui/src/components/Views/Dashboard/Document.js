import React from 'react'
import { connect } from 'react-redux'
import { tagSentence, autoTag } from 'dux/documents'

let Document = ({
  document: d,
  suggestedTags,
  dispatch,
}) =>
  <div>
    <div key={ d.id || d.doc_id }>
      <div style={{ display: `flex`, alignItems: `center` }}>
        <div className="document-title">{ d.name || d.doc_name }</div>

        <button
          className="autotag"
          onClick={ () => dispatch(autoTag({ id: d.doc_id })) }
        >
          AUTO TAG
          <i className="fa fa-magic" />
        </button>
      </div>

      <div>
        <div>
          { d.sentences.map((s, i) =>
            <span
              key={ s.id }
              onClick={ () => dispatch(tagSentence({ sentence: s })) }
              className={ `
                sentence
                ${ s.tag_value ? `tagged` : `` }
                ${ suggestedTags.find(x => x.sentence_id === s.id) ? `has-suggestion` : ``}
              `}
            >
              { s.value.includes(`<br>`)
                ? (d.sentences[i - 2] || { value: `` }).value.includes(`<br>`) ? `` : <br /> 
                : s.value
              }
              {/*{ s.tag_value &&
                <Tooltip show label={ s.tag_value } />
              }*/}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>

export default connect(
  state => ({
    ...state.documents,
  })
)(Document)
