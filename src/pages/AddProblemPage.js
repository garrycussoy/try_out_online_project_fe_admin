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

/**
 * The following class is desingned to handle everything related to Add Problem page
 */
class AddProblemPage extends React.Component {
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
   * The following method is designed to handle the process of posting a new problem
   */
  postNewProblem = async () => {
    /**
      * Prepare some data that will be sent to backend
      */
    // Turn topic from csv format into array format
    let topics = this.props.addProblemTopic.split(", ");
    if (this.props.addProblemTopic === "") {
      topics = [];
    }

    // Prepare options data
    let firstOption = "";
    let secondOption = "";
    let thirdOption = "";
    let fourthOption = "";
    if (this.props.addProblemType === "Pilihan Ganda") {
      firstOption = this.props.addProblemFirstOption;
      secondOption = this.props.addProblemSecondOption;
      thirdOption = this.props.addProblemThirdOption;
      fourthOption = this.props.addProblemFourthOption;
    }

    /**
      * Hit related API to post new problem into database
      */
    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "post",
      url: this.props.baseUrl + "problem",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      data: {
        level: this.props.addProblemLevel,
        topics: topics,
        content: this.props.addProblemContent,
        problem_type: this.props.addProblemType,
        answer: this.props.addProblemAnswer,
        first_option: firstOption,
        second_option: secondOption,
        third_option: thirdOption,
        fourth_option: fourthOption,
        explanation: this.props.addProblemSolution
      },
      validateStatus: (status) => {
        return status < 500
      }
    };

    // Hit related API (passed axiosArgs as the argument) and manage the response
    await axios(axiosArgs)
    .then(response => {
      if (response.status === 200) {
        // Set some props related to problem collection page
        store.setState({
          problemCollectionTopic: "Semua Topik",
          problemCollectionLevel: "Semua Level",
          problemCollectionPage: 1,
          currentPage: "problem-collection-page"
        })

        // Give success message
        Swal.fire({
          title: 'Sukses',
          text: 'Berhasil menambahkan soal baru',
          icon: 'success',
          timer: 3000,
          confirmButtonText: 'OK'
        })

        // Redirect to problem collection page
        this.props.history.push("/problem-collection")
      } else {
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
   * The following method is designed to show the preview of content
   */
  previewContent = async () => {
    // Set the content preview props the same as content props
    await store.setState({
      addProblemContentPreview: this.props.addProblemContent
    })
  }

  /**
   * The following method is designed to show the preview of solution
   */
  previewSolution = () => {
    // Set the solution preview props the same as solution props
    store.setState({
      addProblemSolutionPreview: this.props.addProblemSolution
    })
  }
  
  /**
   * The following method is designed to handle cancel button
   */
  cancelButton = async () => {
    // Set some props to the default
    store.setState({
      // Add problem page props
      addProblemType: "Isian Singkat",
      addProblemLevel: "SBMPTN",
      addProblemTopic: "",
      addProblemContent: "",
      addProblemContentPreview: "",
      addProblemAnswer: "",
      addProblemSolution: "",
      addProblemSolutionPreview: "",
      addProblemFirstOption: "",
      addProblemSecondOption: "",
      addProblemThirdOption: "",
      addProblemFourthOption: "",

      // Problem collection page props
      problemCollectionPage: 1,
      problemCollectionTopic: "Semua Topik",
      problemCollectionLevel: "Semua Level",

      // Current page props
      currentPage: "problem-collection-page"
    })
    
    // Redirect to problem collection page
    await this.props.history.push("/problem-collection")
  }
  
  /**
   * The following method is designed to render the view of add problem page
   */
  render() {    
    // Define a jsx variable that will provide all levels available
    const availableLevels = this.props.availableLevels.map(level => {
      return (
        <option value = {level}>{level}</option>
      )
    })

    // Convert preview string into jsx latex form
    let contentPreview = this.convertToLatex(this.props.addProblemContentPreview);
    let solutionPreview = this.convertToLatex(this.props.addProblemSolutionPreview);

    // Return the view of add problem page
    return (
      <React.Fragment>
        <div className = "container">
          <div className = "row">
            <div className = "col-12 add-problem-title-container">
              HALAMAN TAMBAH SOAL
            </div>
            <div className = "col-12 add-problem-form-container">
              <form className = "form-group" onSubmit = {e => e.preventDefault(e)}>
                <div className = "container-fluid">
                  <div className = "row">
                    <div className = "col-12 add-problem-first-layer">
                      <input onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-first-layer-input" type = "text" name = "addProblemTopic" placeholder = "Topik"/>
                      <span>* Jika topik lebih dari satu, pisahkan dengan tanda koma</span>
                      <select onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-first-layer-input" name = "addProblemLevel">
                        {availableLevels}
                      </select>
                      <select onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-first-layer-input" name = "addProblemType">
                        <option value = "Isian Singkat">Isian Singkat</option>
                        <option value = "Pilihan Ganda">Plihan Ganda</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className = "container-fluid">
                  <div className = "row">
                    <div className = "col-12 add-problem-second-layer">
                      <div className = "container-fluid">
                        <div className = "row">
                          <div className = "col-md-6 col-12 add-problem-text-area">
                            <label for = "problem-content">Pernyataan Soal</label>
                            <textarea onChange = {(e) => this.props.handleOnChange(e)} className = "form-control" id = "problem-content" name = "addProblemContent"></textarea>
                          </div>
                          <div className = "col-md-6 col-12 add-problem-preview">
                            <label for = "problem-content-preview">Pratinjau Soal</label>
                            <p id = "problem-content-preview" className = "add-problem-content-preview">
                              {contentPreview}
                            </p>
                          </div>
                          <div className = "col-12 add-problem-preview-button">
                            <button onClick = {() => this.previewContent()} className = "btn btn-primary">Tinjau Soal</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className = "col-12 add-problem-third-layer">
                      <div className = "container-fluid">
                        <div className = "row">
                          <div className = "col-md-6 col-12 add-problem-text-area">
                            <label for = "problem-solution">Solusi Lengkap</label>
                            <textarea onChange = {(e) => this.props.handleOnChange(e)} className = "form-control" id = "problem-solution" name = "addProblemSolution"></textarea>
                          </div>
                          <div className = "col-md-6 col-12 add-problem-preview">
                            <label for = "problem-solution-preview">Pratinjau Solusi</label>
                            <p id = "problem-solution-preview" className = "add-problem-solution-preview">
                              {solutionPreview}
                            </p>
                          </div>
                          <div className = "col-12 add-problem-preview-button">
                            <button onClick = {() => this.previewSolution()} className = "btn btn-primary">Tinjau Solusi</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className = "col-12 add-problem-fourth-layer">
                      <div className = "container-fluid">
                        <div className = "row">
                          <div className = "col-12 col-md-3 add-problem-option-container">
                            <input onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer" type = "text" name = "addProblemAnswer" placeholder = "Jawaban"/>
                            <input onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer" type = "text" name = "addProblemFirstOption" placeholder = "Pilihan 1"/>
                          </div>
                          <div className = "col-12 col-md-3 add-problem-option-container">
                            <input onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer add-problem-input-other-option" type = "text" name = "addProblemSecondOption" placeholder = "Pilihan 2"/>
                          </div>
                          <div className = "col-12 col-md-3 add-problem-option-container">
                            <input onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer add-problem-input-other-option" type = "text" name = "addProblemThirdOption" placeholder = "Pilihan 3"/>
                          </div>
                          <div className = "col-12 col-md-3 add-problem-option-container">
                            <input onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer add-problem-input-other-option" type = "text" name = "addProblemFourthOption" placeholder = "Pilihan 4"/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className = "col-12 add-problem-fifth-layer">
                      <button onClick = {() => this.cancelButton()} className = "btn btn-danger">Batal</button>
                      <button onClick = {() => this.postNewProblem()} className = "btn btn-primary" type = "submit">Simpan</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

// Define variables that will be passed to connect method as an argument
let addProblemPageProps = "addProblemType, addProblemLevel, addProblemTopic, addProblemContent, addProblemContentPreview, addProblemAnswer, addProblemSolution, addProblemSolutionPreview, addProblemFirstOption, addProblemSecondOption, addProblemThirdOption, addProblemFourthOption, ";
let problemCollectionPageProps = "problemCollectionPage, problemCollectionMaxPage, problemCollectionTotalProblems, problemCollectionTopic, problemCollectionLevel, problemCollection, ";

export default connect(
    addProblemPageProps + problemCollectionPageProps + "isLogin, baseUrl, currentPage, availableLevels", actions
  )(withRouter(AddProblemPage));