// Import from standard libraries
import React from "react";
import { withRouter, Link, Redirect } from "react-router-dom";

// Import from third party
import swal from "sweetalert2";
import { connect } from "unistore/react";
import { actions } from "../stores/MainStore";

// Import everything related to style
import "../styles/bootstrap.min.css";
import "../styles/main.css";

/**
 * The following class is desingned to handle login page
 */
class LoginPage extends React.Component {
  /**
   * The following method is used to render the view of login page
   */
  render() {
    return (
      <React.Fragment>
        <div className = "container">
          <div className = "row">
            <div className = "col-md-4 col-1"></div>
            <div className = "col-md-4 col-10 login-form-container">
              <h1 className = "login-admin-title">LOGIN ADMIN</h1>
              <form className = "form-group">
                <input name = "username" className = "form-control form-control-sm login-form-input" type = "text" placeholder = "Username" aria-label = "Username" required/>
                <input name = "password" className = "form-control form-control-sm login-form-input" type = "text" placeholder = "Password" aria-label = "Password" required/>
                <button type = "submit" className = "btn btn-primary">Login</button>              
              </form>
            </div>
            <div className = "col-md-4 col-1"></div>
          </div>
        </div>
      </React.Fragment>  
    )
  }
};

export default connect("username", actions)(withRouter(LoginPage));
  