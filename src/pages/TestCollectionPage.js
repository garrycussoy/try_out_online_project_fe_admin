// Import from standard libraries
import React from "react";
import { withRouter, Link, Redirect } from "react-router-dom";

// Import from third party
import Swal from "sweetalert2";
import axios from "axios";
import { connect } from "unistore/react";
import { actions, store } from "../stores/MainStore";
import Latex from "react-latex";

// Import everything related to style
import "../styles/bootstrap.min.css";
import "../styles/main.css";
import lookIcon from "../images/search.png";
import cancelIcon from "../images/cancel.png";
import tickIcon from "../images/tick.png";

// Import from other modules
import Header from "../components/Header";

/**
 * The following class is desingned to handle everything related to Test Collection page
 */
class TestCollectionPage extends React.Component {
  /**
   * The following method is designed to redirect the page into test detail for selected test
   * @param {integer} testId Id of the selected test that we want to look the detail of
   */
  testDetail = (testId) => {
    // Set some props to default
    store.setState({
      // Test collection props
      testCollection: [],
      testCollectionName: "",

      // Current page props
      currentPage: "test-detail-page"
    })
    
    // Redirect the page
    this.props.history.push("/test/detail/" + testId)
  }

  /**
   * The following method is designed to convert is_show variable into appropriate icon
   * @param {bool} status is_show variable that want to be converted
   */
  isShowConverter = (status) => {
    if (status === false) {
      return (
        <React.Fragment>
          <img src = {cancelIcon} className = "status-icon" />
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <img src = {tickIcon} className = "status-icon" />
        </React.Fragment>
      )
    }
  }
  
  /**
   * The following method is designed to prepare any information needed before the test collection page is 
   * rendered
   */
  componentDidMount = async () => {
    // Check whether the admin has already logged in or not
    if (this.props.isLogin) {
      /**
       * When admin has been logged in, hit related API to get all information needed to be shown in test 
       * collection page
       */
      // Define object that will be passed as an argument to axios function
      const axiosArgs = {
        method: "get",
        url: this.props.baseUrl + "test",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`
        },
        validateStatus: (status) => {
          return status < 500
        }
      };

      // Hit related API (passed axiosArgs as the argument) and manage the response
      await axios(axiosArgs)
      .then(response => {
        // Set the store using the data returned by the API
        store.setState({
          // Test collection props
          testCollection: response.data,
          currentPage: "test-collection-page",

          // Problem collection props
          problemCollectionTopic: "Semua Topik",
          problemCollectionLevel: "Semua Level",
          problemCollectionPage: 1
        })
      })
      .catch(error => {
        console.warn(error);
      });
    } else {
      // Redirect to login page
      this.props.history.push('/login');
    }
  }
  
  /**
   * The following method is used to render the view of test collection page
   */
  render() {
    // Define jsx variable that will provide all test collection
    let testCollection = (
      <React.Fragment>
        <table className = "table table-bordered">
          <thead>
            <tr>
              <th>ID Tes</th>
              <th>Nama Tes</th>
              <th>Tampilkan</th>
              <th>Waktu</th>
              <th>Skor Maks.</th>
              <th>Total PG</th>
              <th>Total Isian</th>
            </tr>
          </thead>
          <tbody>
            {this.props.testCollection.map(test => {
              return (
                <React.Fragment>
                  <tr className = "each-test-data">
                    <td>{test.id}</td>
                    <td onClick = {() => this.testDetail(test.id)} className = "each-test-data-name">{test.name}</td>
                    <td className = "each-test-data-status">{this.isShowConverter(test.is_show)}</td>
                    <td>{test.time_limit}</td>
                    <td>{test.maximum_score}</td>
                    <td>{test.mc_total_problem}</td>
                    <td>{test.sa_total_problem}</td>
                  </tr>
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </React.Fragment>
    )

    // Return the view of test collection page
    return (
      <React.Fragment>
        <Header />
        <div className = "container">
          <div className = "row test-collection-second-header-container">
            <div className = "col-md-4 col-12 test-collection-search-bar-container">
              <form className = "form-inline" onSubmit = {(e) => e.preventDefault(e)}>
                <input className = "form-control test-collection-search-bar" name = "testCollectionName" type = "text" placeholder = "Nama Tes"></input>
                <img src = {lookIcon} alt = "Search" />
              </form>
            </div>
            <div className = "col-md-4 col-12 test-collection-title-container">
              KOLEKSI TES
            </div>
            <div className = "col-md-4 col-12 add-test-button-container">
              <button className = "btn btn-primary">Tambah Tes</button>
            </div>
          </div>
        </div>
        <div className = "container">
          <div className = "row">
            <div className = "col-12 test-collection-container">
              {testCollection}
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
};

// Define variables that will be passed to connect method as an argument
let problemCollectionPageProps = "problemCollectionPage, problemCollectionMaxPage, problemCollectionTotalProblems, problemCollectionTopic, problemCollectionLevel, problemCollection, ";
let testCollectionPageProps = "testCollection, testCollectionName, "

export default connect(
  problemCollectionPageProps + testCollectionPageProps + "availableTopics, availableLevels, isLogin, baseUrl, currentPage", actions
)(withRouter(TestCollectionPage));
