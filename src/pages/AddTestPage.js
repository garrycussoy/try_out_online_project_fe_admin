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
import addIcon from "../images/plus.png";
import removeIcon from "../images/bin.png";

/**
 * The following class is desingned to handle everything related to Add Test page
 */
class AddTestPage extends React.Component {
  /**
   * The follwoing method is designed add new test into database
   */
  addTestButton = async () => {
    /**
      * Hit related API to post new test into database
      */
    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "post",
      url: this.props.baseUrl + "test",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      data: {
        name: this.props.addTestName,
        description: this.props.addTestDescription,
        is_show: this.props.addTestStatus,
        time_limit: this.props.addTestTimeLimit,
        mc_correct_scoring: this.props.addTestMCCorrectScoring,
        mc_wrong_scoring: this.props.addTestMCWrongScoring,
        sa_correct_scoring: this.props.addTestSACorrectScoring,
        sa_wrong_scoring: this.props.addTestSAWrongScoring,
        problems: this.props.addTestProblems
      },
      validateStatus: (status) => {
        return status < 500
      }
    };

    // Hit related API (passed axiosArgs as the argument) and manage the response
    await axios(axiosArgs)
    .then(response => {
      if (response.status === 200) {
        // Set some props
        store.setState({
          // Add test props
          addTestName: "",
          addTestStatus: false,
          addTestDescription: "",
          addTestTimeLimit: 0,
          addTestSACorrectScoring: 0,
          addTestMCCorrectScoring: 0,
          addTestSAWrongScoring: 0,
          addTestMCWrongScoring: 0,
          addTestProblems: [],
          addTestProblemId: "",

          // Test collection props
          testCollectionName: "",
          testCollectionKeyword: "",

          // Current page props
          currentPage: "test-collection-page"
        })

        // Give success message
        Swal.fire({
          title: 'Sukses',
          text: 'Berhasil menambahkan tes baru',
          icon: 'success',
          timer: 3000,
          confirmButtonText: 'OK'
        })

        // Redirect to test collection page
        this.props.history.push("/test-collection")
      } else {
        // Return failure message
        Swal.fire({
          title: 'Gagal',
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
   * The follwoing method is designed to remove a problem from the test
   * @param {integer} index The number of selected problem
   */
  removeProblemButton = async (index) => {
    // Remove the problem from the list
    let problems = this.props.addTestProblems;
    let newProblems = [];
    for (let order = 0; order < problems.length; order++) {
      if (order !== index) {
        newProblems.push(problems[order])
      }
    }

    // Adjust related props in the store
    await store.setState({
      addTestProblems: newProblems
    })
  }
  
  /**
   * The following method is designed to handle cancel button
   */
  cancelButton = async () => {
    // Set some props to the default
    store.setState({
      // Add test props
      addTestName: "",
      addTestStatus: false,
      addTestDescription: "",
      addTestTimeLimit: 0,
      addTestSACorrectScoring: 0,
      addTestMCCorrectScoring: 0,
      addTestSAWrongScoring: 0,
      addTestMCWrongScoring: 0,
      addTestProblems: [],
      addTestProblemId: "",

      // Test collection props
      testCollectionName: "",
      testCollectionKeyword: "",

      // Current page props
      currentPage: "test-collection-page"
    })
    
    // Redirect to test collection page
    await this.props.history.push("/test-collection")
  }

  /**
   * The follwoing method is designed to add a problem from the test
   * @param {integer} problemId The ID of selected problem
   */
  addProblemButton = async (problemId) => {
    // Check whether the problem has already exist or not
    let duplicate = false;
    for (let index = 0; index < this.props.addTestProblems.length; index++) {
      let problem = this.props.addTestProblems[index]
      if (parseInt(problemId) === parseInt(problem.id)) {
        duplicate = true;
        break;
      }
    }

    if (duplicate === true) {
      // Return failure message
      await Swal.fire({
        title: 'Gagal',
        text: 'Soal dengan ID ' + problemId + ' sudah ada di daftar soal',
        icon: 'error',
        timer: 3000,
        confirmButtonText: 'OK'
      })
    } else {
      /**
         * Hit related API to get information of the problem
         */
      // Define object that will be passed as an argument to axios function
      const axiosArgs = {
        method: "get",
        url: this.props.baseUrl + "problem/" + problemId,
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
      .then(async response => {
        if (response.status === 200) {
          /**
           * Set the store using the response returned by the API
           */
          // Define variable needed
          let responseData = {
            id: response.data.id,
            type: response.data.problem_type,
            level: response.data.level,
            topic: response.data.topic
          }

          // Append new data to problems list
          let problems = this.props.addTestProblems;
          let newProblems = [];
          for (let order = 0; order < problems.length; order++) {
            newProblems.push(problems[order]);
          }
          newProblems.push(responseData);

          // Set the props
          await store.setState({
            addTestProblems: newProblems
          })
        } else {
          // Return failure message
          await Swal.fire({
            title: 'Gagal',
            text: 'Soal dengan ID ' + problemId + ' tidak ditemukan',
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
   * The following method is designed to render the view of add test page
   */
  render() {
    // Define jsx variable that will provide all problems in the test
    let addTestProblems = (
      <React.Fragment>
        <table className = "table table-bordered add-test-problem-table">
          <thead>
            <tr>
              <th className = "cell-fix-width-100">Nomor</th>
              <th className = "cell-fix-width-100">Problem ID</th>
              <th>Tipe</th>
              <th>Level</th>
              <th className = "cell-min-width-200">Topik</th>
              <th className = "cell-fix-width-100">Batal</th>
            </tr>
          </thead>
          <tbody>
            {
              this.props.addTestProblems.map((element, index) => {
                return (
                  <tr>
                    <td>{index + 1}</td>
                    <td>{element.id}</td>
                    <td>{element.problemType}</td>
                    <td>{element.level}</td>
                    <td>{element.topic}</td>
                    <td>
                      <img onClick = {() => this.removeProblemButton(index)} alt = "Remove Problem Icon" src = {removeIcon} className = "add-test-remove-problem-icon" />
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </React.Fragment>
    )

    // Return the view of add problem page
    return (
      <React.Fragment>
        <div className = "container">
          <div className = "row">
            <div className = "col-12 add-test-header-container">
              HALAMAN TAMBAH TEST
            </div>
          </div>
        </div>
        <form className = "form-group" onSubmit = {e => e.preventDefault(e)}>
          <div className = "container">
            <div className = "row">
              <div className = "col-12 add-test-first-layer">
                <input name = "addTestName" onChange = {(e) => this.props.handleOnChange(e)} className = "form-control first-type-input" placeholder = "Nama Tes" name = "addTestName"></input>
                <label><input name = "addTestStatus" onChange = {(e) => this.props.handleOnChange(e)} className = "checkbox-type-input checkbox-inline" type = "checkbox" value = {true}/>Centang untuk menampilkan tes ini di halaman pengguna</label><br />
                <span className = "add-test-description">Deskripsi</span><br />
                <textarea name = "addTestDescription" onChange = {(e) => this.props.handleOnChange(e)} className = "form-control textarea-type-input" name = "addTestDescription"></textarea><br />
                <input name = "addTestTimeLimit" onChange = {(e) => this.props.handleOnChange(e)} className = "form-control first-type-input" placeholder = "Batas Waktu" name = "addTestTimeLimit"></input>
                <span>Masukkan dalam menit (harus bilangan bulat positif)</span><br />
                <span className = "add-test-sub-header-left">Isian Singkat</span>
                <span className = "add-test-description">Pilihan Ganda</span><br />
                <input name = "addTestSACorrectScoring" onChange = {(e) => this.props.handleOnChange(e)} className = "form-control second-type-input" placeholder = "Skor Benar" name = "addTestSACorrectScoring"></input>
                <input name = "addTestSAWrongScoring" onChange = {(e) => this.props.handleOnChange(e)} className = "form-control second-type-input" placeholder = "Skor Salah" name = "addTestSAWrongScoring"></input>
                <input name = "addTestMCCorrectScoring" onChange = {(e) => this.props.handleOnChange(e)} className = "form-control second-type-input" placeholder = "Skor Benar" name = "addTestMCCorrectScoring"></input>
                <input name = "addTestMCWrongScoring" onChange = {(e) => this.props.handleOnChange(e)} className = "form-control second-type-input" placeholder = "Skor Salah" name = "addTestMCWrongScoring"></input><br />
                <span>Skor benar dan skor salah harus berupa bilangan bulat</span>
              </div>
              <div className = "col-12 col-md-8 add-test-choose-problem-bar">
                <span className = "add-test-choose-problem-title">Pilih Soal</span>
                <input name = "addTestProblemId" onChange = {(e) => this.props.handleOnChange(e)} className = "form-control third-type-input" placeholder = "Masukkan Problem ID"></input>
                <img onClick = {() => this.addProblemButton(this.props.addTestProblemId)} className = "add-test-add-problem-icon" alt = "Add Icon" src = {addIcon} />
              </div>
              <div className = "col-12 col-md-4 add-test-post-test">
                <button onClick = {() => this.addTestButton()} className = "btn btn-primary" type = "submit">Tambah Tes</button>
              </div>
              <div className = "col-12 add-test-problem-table-container">
                {addTestProblems}
              </div>
              <div className = "col-12 add-test-back-button-container">
                <button onClick = {() => this.cancelButton()} className = "btn btn-danger">Batal</button>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

// Define variables that will be passed to connect method as an argument
let addTestPageProps = "addTestProblemId, addTestName, addTestDescription, addTestStatus, addTestTimeLimit, addTestSACorrectScoring, addTestSAWrongScoring, addTestMCCorrectScoring, addTestMCWrongScoring, addTestProblems, ";
let testCollectionPageProps = "testCollection, testCollectionName, testCollectionKeyword, "

export default connect(
    addTestPageProps + testCollectionPageProps + "isLogin, baseUrl, currentPage, availableLevels", actions
  )(withRouter(AddTestPage));
