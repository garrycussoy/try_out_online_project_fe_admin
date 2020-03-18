// Import from standard libraries
import React from "react";
import { withRouter, Link, Redirect } from "react-router-dom";

// Import from third party
import { connect } from "unistore/react";
import { actions, store } from "../stores/MainStore";

// Import everything related to style
import "../styles/bootstrap.min.css";
import "../styles/main.css";
import mathemaniacLogo from "../images/mathemaniacLogo.jpg";

/**
 * The following function is used to render Heaader component, taht will be often used accross all pages
 * 
 * @param {object} props This object contains all props needed that are stored in MainStore.js file 
 */
const Header = props => {
  // Define variable for currentPage props
  let currentPage = props.currentPage;
  
  // Return the view of problem collection page
  return (
    <React.Fragment>
      <header className = "header">
        <div className = "container-fluid">
          <div className = "row">
            <div className = "col-md-2 col-12 logo-container">
              <img src = {mathemaniacLogo} className = "logo-in-header"/>
            </div>
            <div className = "col-md-6 col-12"></div>
            <div className = "col-md-4 col-12 tabs-container-div">
              <ul className = "tabs-container-ul">
                <li>
                  {currentPage === "problem-collection-page" ?
                  <Link className = "tab-in-header active-tab" to = "/problem-collection">Koleksi Soal</Link> :
                  <Link className = "tab-in-header" to = "/problem-collection">Koleksi Soal</Link>
                  }
                </li>
                <li>
                  {currentPage === "test-collection-page" ?
                  <Link className = "tab-in-header active-tab" to = "/test-collection">Koleksi Tes</Link> :
                  <Link className = "tab-in-header" to = "/test-collection">Koleksi Tes</Link>
                  }
                </li>
                <li>
                  <Link onClick = {e => props.handleLogout()} className = "tab-in-header" to = "/login">Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

export default connect("currentPage", actions)(withRouter(Header));
