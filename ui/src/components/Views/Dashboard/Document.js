import React from 'react'
import { connect } from 'react-redux'
import Tooltip from 'material-ui/lib/tooltip'
import { tagSentence, autoTag } from 'dux/documents'
import { togglePopover } from 'dux/popover'

let Document = ({
  document: d,
  suggestedTags,
  dispatch,
  popoverId,
  popoverContent,
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
        <div style={{ maxWidth: `45rem` }}>
          { d.sentences.map((s, i) =>
            <span
              style={{ position: `relative` }}
              key={ s.id }
              onClick={ () => dispatch(tagSentence({ sentence: s })) }
              onMouseOver={
                () => {
                  if (s.tag_value || suggestion) {
                    dispatch(togglePopover({
                      popoverContent: s.tag_value,
                      popoverId: s.id,
                    }))
                  }
                }
              }
              onMouseOut={ () => dispatch(togglePopover()) }
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

              { popoverId === s.id &&
                <Tooltip
                  show={ popoverId !== null }
                  label={ popoverContent }
                  horizontalPosition="left"
                  verticalPosition="top"
                  touch
                />
              }

              { suggestedTags.filter(x => x.sentence_id === s.id).map(x =>
                <div
                  key={x.id}
                  style={{
                    padding: `0.5rem`,
                    margin: `0.5rem`,
                    border: `1px solid black`,
                    borderRadius: `6px`,
                    display: `flex`,
                  }}>
                  <div>{ x.tag_value }</div>
                  <div style={{ marginLeft: `auto`, display: `flex` }}>
                    <button>Keep</button>
                    <button style={{ marginLeft: `10px`, color: `red` }}>Discard</button>
                  </div>
                </div>
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  </div>

export default connect(
  state => ({
    ...state.documents,
    ...state.popover,
  })
)(Document)
