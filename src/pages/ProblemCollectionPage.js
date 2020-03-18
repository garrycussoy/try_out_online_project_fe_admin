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

// Import from other modules
import Header from "../components/Header"

/**
 * The following class is desingned to handle everything related to Problem Collection page
 */
class ProblemCollectionPage extends React.Component {
  /**
   * The following method is designed to prepare any information needed before the problem collection page is 
   * rendered
   */
  componentDidMount = async () => {
    // Check whether the admin has already logged in or not
    if (this.props.isLogin) {
      /**
       * When admin has been logged in, hit related API to get all information needed to be shown in problem 
       * collection page
       */
      // Define object that will be passed as an argument to axios function
      const axiosArgs = {
        method: "get",
        url: this.props.baseUrl + "problem-collection",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        data: {
          page: this.props.problemCollectionPage,
          topic: this.props.problemCollectionTopic,
          level: this.props.problemCollectionLevel
        },
        validateStatus: (status) => {
          return status < 500
        }
      };

      // Hit related API (passed axiosArgs as the argument) and manage the response
      await axios(axiosArgs)
      .then(response => {
        // Set the store using the data returned by the API
        // LANJUTIN NANTI YAAA, ABIS SELESEIN BAGIAN RENDERNYAAA HEHEHE
      })
      .catch(error => {
        console.warn(error);
      });
    } else {
      // Redirect to login page
      this.props.history.push('/login')
    }
  }

  /**
   * The following method is used to render the view of problem collection page
   */
  render() {
    return (
      <React.Fragment>
        <Header />
      </React.Fragment>
    )
  }
};

export default connect(
  "problemCollectionPage, problemCollectionTopic, problemCollectionLevel, isLogin, baseUrl, currentPage", actions
)(withRouter(ProblemCollectionPage));
