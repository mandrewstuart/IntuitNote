import React from 'react'
import { connect } from 'react-redux'
import { discardSuggestion, createTag } from 'dux/documents'

let Suggestion = ({
  id,
  suggestion,
  dispatch,
}) =>
  <div
    style={{
      padding: `0.5rem`,
      margin: `0.5rem`,
      border: `1px solid black`,
      borderRadius: `6px`,
      display: `flex`,
    }}>
    <div>{ suggestion.tag_value }</div>
    <div style={{ marginLeft: `auto`, display: `flex` }}>
      <button
        onClick={
          event => {
            dispatch(createTag({ id, value: suggestion.tag_value }))
            dispatch(discardSuggestion({ suggestion }))
            event.stopPropagation()
            event.preventDefault()
          }
        }
      >
        Keep
      </button>
      <button
        className="delete-btn"
        onClick={
          event => {
            dispatch(discardSuggestion({ suggestion }))
            event.stopPropagation()
            event.preventDefault()
          }
        }
        style={{ marginLeft: `10px` }}
      >
        Discard
      </button>
    </div>
  </div>

export default connect()(Suggestion)
