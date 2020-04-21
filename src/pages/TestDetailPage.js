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
import EditTestModal from "../components/EditTestModal";

/**
 * The following class is desingned to handle everything related to Test Detail page
 */
class TestDetailPage extends React.Component {
  /**
   * The following method is designed to remove selected test
   */
  removeTestButton = async () => {
    /**
       * Hit related API to remove selected test
       */
    // Get the parameter in URL
    let matchUrlArray = this.props.match.url.split("/");
    let matchUrlArrayLength = matchUrlArray.length;
    let testId = matchUrlArray[matchUrlArrayLength - 1];

    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "delete",
      url: this.props.baseUrl + "test/" + testId,
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
    .then(async (response) => {
      if (response.status === 200) {
        // Set some props to default
        store.setState({
          testCollectionName: "",
          testCollectionKeyword: ""
        })

        // Give success message
        await Swal.fire({
          title: 'Sukses',
          text: 'Berhasil menghapus paket tes',
          icon: 'success',
          timer: 3000,
          confirmButtonText: 'OK'
        })

        // Redirect to test collection page
        await this.props.history.push("/test-collection")
      } else {
        // Give failure message
        await Swal.fire({
          title: 'Gagal Menghapus Tes',
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
  
  /**
   * The following method is used to redirect the page into test collection page
   */
  backButton = () => {
    // Set some props to default
    store.setState({
      // Test collection props
      testCollection: [],
      testCollectionName: "",
      testCollectionKeyword: ""
    })

    // Redirect the page
    this.props.history.push("/test-collection")
  }
  
  /**
   * The following method is designed to prepare any data before the view is rendered
   */
  componentDidMount = async () => {
    // Check whether the admin has already logged in or not
    if (this.props.isLogin) {
      /**
       * When admin has been logged in, hit related API to get all information needed to be shown in test
       * detail page
       */
      // Get the parameter in URL
      let matchUrlArray = this.props.match.url.split("/");
      let matchUrlArrayLength = matchUrlArray.length;
      let testId = matchUrlArray[matchUrlArrayLength - 1];

      // Define object that will be passed as an argument to axios function
      const axiosArgs = {
        method: "get",
        url: this.props.baseUrl + "test/" + testId,
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
        // Set some props using the information given by the API
        store.setState({
          // Current page props
          currentPage: "test-detail-page",

          // Test collection props
          testCollection: [],
          testCollectionName: "",
          testCollectionKeyword: "",

          // Test detail props
          testDetailName: response.data.name,
          testDetailTimeLimit: response.data.time_limit,
          testDetailSATotalProblems: response.data.sa_total_problem,
          testDetailMCTotalProblems: response.data.mc_total_problem,
          testDetailSACorrectScoring: response.data.sa_correct_scoring,
          testDetailMCCorrectScoring: response.data.mc_correct_scoring,
          testDetailSAWrongScoring: response.data.sa_wrong_scoring,
          testDetailMCWrongScoring: response.data.mc_wrong_scoring,
          testDetailMaximumScore: response.data.maximum_score,
          testDetailDescription: response.data.description,
          testDetailProblems: response.data.problems,

          // Edit test props
          editTestName: response.data.name,
          editTestDescription: response.data.description
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
   * The following method is used to render the view of test detail page
   */
  render() {
    // Define jsx variables that will generate all problems of the test
    let problems = (
      <table className = "table table-bordered test-detail-problem-table">
        <thead>
          <tr>
            <th className = "cell-fix-width-100">Nomor</th>
            <th className = "cell-fix-width-100">Problem ID</th>
            <th>Tipe</th>
            <th>Level</th>
            <th className = "cell-min-width-200">Topik</th>
          </tr>
          {
            this.props.testDetailProblems.map((problem, order) => {
              return (
                <tr>
                  <td>{order + 1}</td>
                  <td>{problem.id}</td>
                  <td>{problem.problem_type}</td>
                  <td>{problem.level}</td>
                  <td>{problem.topic}</td>
                </tr>
              )
            })
          }
        </thead>
      </table>
    )

    // Return the view of test detail page
    return (
      <React.Fragment>
        <Header />
        <div className = "container">
          <div className = "row">
            <div className = "col-12 test-detail-header">
              <span className = "test-detail-title">{this.props.testDetailName}</span><br />
              <span className = "test-detail-time-limit">Waktu Pengerjaan : {this.props.testDetailTimeLimit} Menit</span>
            </div>
            <div className = "col-md-3 col-12"></div>
            <div className = "col-md-6 col-12 test-detail-characteristic-container">
              <table className = "table table-bordered characteristic-table">
                <thead>
                  <tr>
                    <th>Tipe</th>
                    <th>Total Soal</th>
                    <th>Skor Benar</th>
                    <th>Skor Salah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Isian Singkat</td>
                    <td>{this.props.testDetailSATotalProblems}</td>
                    <td>{this.props.testDetailSACorrectScoring}</td>
                    <td>{this.props.testDetailSAWrongScoring}</td>
                  </tr>
                  <tr>
                    <td>Pilihan Ganda</td>
                    <td>{this.props.testDetailMCTotalProblems}</td>
                    <td>{this.props.testDetailMCCorrectScoring}</td>
                    <td>{this.props.testDetailMCWrongScoring}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className = "col-md-3 col-12"></div>
            <div className = "col-12 characterisctic-container-bottom-border">
              Skor Maksimal : {this.props.testDetailMaximumScore}
            </div>
            <div className = "col-12 test-detail-description-container">
              <span className = "test-detail-description">Deskripsi</span>
              <div className = "test-detail-description-box">{this.props.testDetailDescription}</div>
            </div>
          </div>
          <div className = "col-12 test-detail-problem-table-container">
            {problems}
          </div>
          <div className = "col-12 test-detail-button-container">
            <button data-toggle = "modal" data-target = "#editTest" className = "btn btn-primary test-detail-button">Ubah</button>
            <button onClick = {() => this.removeTestButton()} className = "btn btn-danger test-detail-button">Hapus</button>
            <button onClick = {() => this.backButton()} className = "btn btn-primary test-detail-button">Kembali</button>
          </div>
          <EditTestModal />
        </div>
      </React.Fragment>
    )
  }
};

// Define variables that will be passed to connect method as an argument
let testCollectionPageProps = "testCollection, testCollectionName, testCollectionKeyword, ";
let testDetailPageProps = "testDetailName, testDetailTimeLimit, testDetailSATotalProblems, testDetailMCTotalProblems, testDetailSACorrectScoring, testDetailMCCorrectScoring, testDetailSAWrongScoring, testDetailMCWrongScoring, testDetailMaximumScore, testDetailDescription, testDetailProblems, ";
let editTestModalProps = "editTestName, editTestDescription, "

export default connect(
  testCollectionPageProps + testDetailPageProps + editTestModalProps + "isLogin, baseUrl, currentPage", actions
)(withRouter(TestDetailPage));
