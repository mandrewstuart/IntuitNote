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
      Bacon ipsum dolor amet tri-tip chicken t-bone tail. <br />
      Doner kielbasa flank short ribs tri-tip, tongue tail filet mignon pork pork
      belly shankle biltong pig. <br />
      Meatball pork chop venison corned beef, alcatra chuck short ribs.
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
          <a
            className="hvr-underline-from-left"
            onClick={ () => dispatch(logout()) }
          >
            <i className="fa fa-user" />
            GO TO DASHBOARD
          </a>
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
