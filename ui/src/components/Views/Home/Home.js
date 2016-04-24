import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import { toggleModal } from 'dux/modal'
import { logout } from 'dux/auth'

let Home = ({
  loggedIn,
  user,
  dispatch,
}) =>
  <div className="home">
    <Link className="logo" to="/">APPRENTICE DATA EXTRACTOR</Link>
    <p>
      Project ADE is Software as a Service for people who extract data from texts.<br />
      Not only can you tag and extract sentences with tags, we will also suggest new tags for you based on prior tags.
    </p>

    <p>
      Our Freemium model means you can try for free now, then pay only if you decide you like it.<br />
      Sign up, create subjects, insert documents, tag sentences, and please let us know what you think.
    </p>

    <p>
      Contact <a href="mailto:info@projectade.com">info@projectade.com</a> with comments, question, concerns, or queries.
    </p>

    <div className="menu">
      {/* PUT BACK IN PROD

        <a className="hvr-underline-from-right">About</a>
      <a className="hvr-underline-from-right">Pricing</a>*/}
      { loggedIn ||
        <div className="login-link">
          <a
            className="hvr-underline-from-left"
            onClick={ () => dispatch(toggleModal(`AuthModal`)) }
          >
            <i className="fa fa-user" />
            LOGIN / SIGN UP
          </a>
        </div>
      }
      { loggedIn &&
        <div className="login-link">
          <Link
            className="hvr-underline-from-left"
            to="/dashboard"
          >
            <i className="fa fa-user" />
            GO TO DASHBOARD
          </Link>
        </div>
      }
    </div>
    <i className="fa fa-file-archive-o" />
  </div>

export default connect(
  state => ({
    ...state.auth,
  })
)(Home)
