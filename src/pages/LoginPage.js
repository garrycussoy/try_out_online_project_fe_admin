// Import from standard libraries
import React from "react";
import { withRouter, Link, Redirect } from "react-router-dom";

// Import from third party
import Swal from "sweetalert2";
import axios from "axios";
import { connect } from "unistore/react";
import { actions, store } from "../stores/MainStore";

// Import everything related to style
import "../styles/bootstrap.min.css";
import "../styles/main.css";

/**
 * The following class is desingned to handle login page
 */
class LoginPage extends React.Component {
  /**
   * The following method is used to handle login section
   */
  handleLogin = async () => {
    // Check for emptyness
    if (this.props.username === "" || this.props.password === "") {
      Swal.fire({
        title: 'Login gagal',
        text: 'Username dan password tidak boleh dikosongkan',
        icon: 'error',
        timer: 3000,
        confirmButtonText: 'OK'
      })
    } else {
      // Define object that will be passed as an argument to axios function
      const axiosArgs = {
        method: "post",
        url: this.props.baseUrl + "login-admin",
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          username: this.props.username,
          password: this.props.password
        },
        validateStatus: (status) => {
          return status < 500
        }
      };

      // Hit related API (passed axiosArgs as the argument) and manage the response
      await axios(axiosArgs)
      .then(response => {
        if (response.status === 200) {
          /**
           * 1. Set isLogin to true
           * 2. Save token in local storage
           * 3. Redirect to Problem Collection page
           * 4. Give success message
           */
          store.setState({isLogin: true, currentPage: "problem-collection-page"});
          localStorage.setItem('token', response.data.token)
          this.props.history.push('/problem-collection')
          Swal.fire({
            title: 'Login berhasil',
            text: 'Selamat datang tuan ' + this.props.username,
            icon: 'success',
            timer: 3000,
            confirmButtonText: 'OK'
          })
        } else {
          // Show the reason why the proccess is failed
          Swal.fire({
            title: 'Login gagal',
            text: response.data.message,
            icon: 'error',
            timer: 3000,
            confirmButtonText: 'OK'
          })
        }
      })
      .catch(error => {
        console.warn(error);
      });
    }
  }
  
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
              <form className = "form-group" onSubmit = {e => e.preventDefault(e)}>
                <input onChange = {e => this.props.handleOnChange(e)} name = "username" className = "form-control form-control-sm login-form-input" type = "text" placeholder = "Username" aria-label = "Username"/>
                <input onChange = {e => this.props.handleOnChange(e)} name = "password" className = "form-control form-control-sm login-form-input" type = "password" placeholder = "Password" aria-label = "Password"/>
                <button onClick = {e => this.handleLogin(e)} type = "submit" className = "btn btn-primary">Login</button>              
              </form>
            </div>
            <div className = "col-md-4 col-1"></div>
          </div>
        </div>
      </React.Fragment>  
    )
  }
};

export default connect("username, password, isLogin, baseUrl, currentPage", actions)(withRouter(LoginPage));
  