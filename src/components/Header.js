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
                  <Link className = "tab-in-header" to = "/">Koleksi Soal</Link>
                </li>
                <li>
                  <Link className = "tab-in-header" to = "/">Koleksi Tes</Link>
                </li>
                <li>
                  <Link className = "tab-in-header" to = "/login">Logout</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

export default connect("isOwner", actions)(withRouter(Header));
