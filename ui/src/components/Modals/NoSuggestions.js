import React from 'react'
import { connect } from 'react-redux'
import { toggleModal } from 'dux/modal'

let NoSuggestions = ({
  dispatch,
}) =>
  <div className="confirm modal-content">
    <div className="modal-title">NO SUGGESTIONS</div>
    <div className="new-subject form">
      <div className="button-row">
        <button style={{ color: `#c33521` }} onClick={ () => dispatch(toggleModal()) }>
          CLOSE
        </button>
      </div>
    </div>
  </div>

export default connect()(NoSuggestions)
