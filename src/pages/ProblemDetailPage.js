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

// Import from other modules
import Header from "../components/Header";

/**
 * The following class is desingned to handle everything related to Problem Detail page
 */
class ProblemDetailPage extends React.Component {
  /**
   * The following function is designed to convert string into jsx latex
   * @param {string} content The string that want to be converted into jsx latex
   */
  convertToLatex = content => {
    // Define some variables needed
    let currentState = null;
    let contentLength = content.length;
    let latexForm = "";

    /**
     * Convert the string into latex string
     */
    for (let index = 0; index < contentLength; index++) {
      if (content[index] === "$" && currentState === null) {
        if (index != contentLength - 1) {
          if (content[index + 1] === "$") {
            currentState = "$$";
            index++;
            latexForm = latexForm + "<Latex>$$";
          } else {
            currentState = "$";
            latexForm = latexForm + "<Latex>$";
          }
        } else {
          currentState = "$";
          latexForm = latexForm + "<Latex>$";
        }
      } else if (content[index] === "$" && currentState === "$") {
        currentState = null;
        latexForm = latexForm + "$<Latex>";
      } else if (content[index] === "$" && currentState === "$$") {
        if (index != contentLength - 1) {
          if (content[index + 1] == "$") {
            currentState =  null;
            index++;
            latexForm = latexForm + "$$<Latex>";
          } else {
            latexForm = latexForm + content[index];
          }
        } else {
          latexForm = latexForm + content[index];
        }
      } else {
        latexForm = latexForm + content[index];
      }
    }

    // Check final state
    if (currentState === "$" || currentState === "$$") {
      latexForm = latexForm + "<Latex>";
    }

    /**
     * Turn latex string into jsx latex form
     */
    // Turn latex string into array
    let latexArrayForm = latexForm.split("<Latex>");
    
    // Turn the array into latex jsx form
    const jsxLatex = latexArrayForm.map(section => {
      if (section.startsWith("$$")) {
        return <Latex displayMode = {true}>{section}</Latex>
      } else if (section.startsWith("$")) {
        return <Latex>{section}</Latex>
      } else {
        return <span>{section}</span>
      }
    })
    
    return jsxLatex
  }
  
  /**
   * The following method is designed to redirect the page to problem-collection page
   */
  backButton = async () => {
    // Set some props
    store.setState({
      problemCollectionPage: 1,
      problemCollectionTopic: "Semua Topik",
      problemCollectionLevel: "Semua Level",
      currentPage: "problem-collection-page"
    })
    
    // Redirect to problem-collection page
    await this.props.history.push('/problem-collection');
  }

  /**
   * The following method is designed to prepare any information needed before the problem collection page is 
   * rendered
   * @param {int} problemId ID of selected problem
   */
  componentDidMount = async () => {
    // Check whether the admin has already logged in or not
    if (this.props.isLogin) {
      /**
       * When admin has been logged in, hit related API to get all information needed to be shown in problem
       * detail page
       */
      // Get the parameter in URL
      let matchUrlArray = this.props.match.url.split("/");
      let matchUrlArrayLength = matchUrlArray.length;
      let problemId = matchUrlArray[matchUrlArrayLength - 1];

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
      .then(response => {
        // Set some props using the information given by the API
        store.setState({
          currentPage: "problem-detail-page",
          problemDetailId: response.data.id,
          problemDetailType: response.data.problem_type,
          problemDetailLevel: response.data.level,
          problemDetailTopic: response.data.topic,
          problemDetailContent: response.data.content,
          problemDetailAnswer: response.data.answer,
          problemDetailSolution: response.data.solution,
          problemDetailFirstOption: response.data.first_option,
          problemDetailSecondOption: response.data.second_option,
          problemDetailThirdOption: response.data.third_option,
          problemDetailFourthOption: response.data.fourth_option,
          problemCollectionPage: 1,
          problemCollectionTopic: "Semua Topik",
          problemCollectionLevel: "Semua Level",
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
   * The following method is designed to render the view of problem detail page
   */
  render() {    
    /**
     * Prepare some variables needed in jsx latex form
     */
    // Content of problem
    let content = this.convertToLatex(this.props.problemDetailContent);
    let answer = this.convertToLatex(this.props.problemDetailAnswer);
    let solution = this.convertToLatex(this.props.problemDetailSolution);
    let firstOption = this.convertToLatex(this.props.problemDetailFirstOption);
    let secondOption = this.convertToLatex(this.props.problemDetailSecondOption);
    let thirdOption = this.convertToLatex(this.props.problemDetailThirdOption);
    let fourthOption = this.convertToLatex(this.props.problemDetailFourthOption);

    // Return the view of problem detail page
    return (
      <React.Fragment>
        <Header />
        <div className = "container">
          <div className = "row">
            <div className = "col-12 problem-information-container">
              <span className = "problem-id-and-type">Problem ID {this.props.problemDetailId} ({this.props.problemDetailType})</span><br />
              <span className = "problem-level-and-topic">Level : {this.props.problemDetailLevel}</span><br />
              <span className = "problem-level-and-topic">Topik : {this.props.problemDetailTopic}</span>
            </div>
            <div className = "col-12 problem-content-container">
              <span className = "problem-title">Soal</span><br />
              <span className = "problem-content">{content}</span><br />
              <span className = "problem-answer">Jawaban : {answer}</span><br />
              {
                this.props.problemDetailFirstOption === "" ?
                <span className = "problem-other-options"></span>:
                <span className = "problem-other-options">Pilihan 1 : {firstOption}<br /></span>
              }
              {
                this.props.problemDetailSecondOption === "" ?
                <span className = "problem-other-options"></span>:
                <span className = "problem-other-options">Pilihan 2 : {secondOption}<br /></span>
              }
              {
                this.props.problemDetailThirdOption === "" ?
                <span className = "problem-other-options"></span>:
                <span className = "problem-other-options">Pilihan 3 : {thirdOption}<br /></span>
              }
              {
                this.props.problemDetailFourthOption === "" ?
                <span className = "problem-other-options"></span>:
                <span className = "problem-other-options">Pilihan 4 : {fourthOption}<br /></span>
              }
            </div>
            <div className = "col-12 problem-solution-container">
              <span className = "problem-title">Solusi</span><br />
              <span className>{solution}</span><br />
            </div>
            <div className = "col-12 problem-back-button-container">
              <button onClick = {() => this.backButton()} type = "submit" className = "btn btn-primary problem-back-button">Kembali</button>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default connect(
    "isLogin, baseUrl, currentPage, problemDetailId, problemDetailType, problemDetailLevel, problemDetailTopic, problemDetailContent, problemDetailAnswer, problemDetailFirstOption, problemDetailSecondOption, problemDetailThirdOption, problemDetailFourthOption, problemDetailSolution, problemCollectionPage, problemCollectionTopic, problemCollectionLevel", actions
  )(withRouter(ProblemDetailPage));