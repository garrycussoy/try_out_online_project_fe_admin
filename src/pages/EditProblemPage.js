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
 * The following class is desingned to handle everything related to Edit Problem page
 */
class EditProblemPage extends React.Component {
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
   * The following method is designed to handle the process of editting a new problem
   */
  editProblem = async () => {
    /**
      * Prepare some data that will be sent to backend
      */
    // Turn topic from csv format into array format
    let topics = this.props.editProblemTopic.split(", ");
    if (this.props.editProblemTopic === "") {
      topics = [];
    }

    // Get problem ID
    let matchUrlArray = this.props.match.url.split("/");
    let matchUrlArrayLength = matchUrlArray.length;
    let problemId = matchUrlArray[matchUrlArrayLength - 1];

    // Prepare options data
    let firstOption = '';
    let secondOption = '';
    let thirdOption = '';
    let fourthOption = '';
    if (this.props.editProblemType === "Pilihan Ganda") {
      firstOption = this.props.editProblemFirstOption;
      secondOption = this.props.editProblemSecondOption;
      thirdOption = this.props.editProblemThirdOption;
      fourthOption = this.props.editProblemFourthOption;
    }

    /**
      * Hit related API to edit problem information in database
      */
    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "put",
      url: this.props.baseUrl + "problem/" + problemId,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      data: {
        level: this.props.editProblemLevel,
        topics: topics,
        content: this.props.editProblemContent,
        problem_type: this.props.editProblemType,
        answer: this.props.editProblemAnswer,
        first_option: firstOption,
        second_option: secondOption,
        third_option: thirdOption,
        fourth_option: fourthOption,
        explanation: this.props.editProblemSolution
      },
      validateStatus: (status) => {
        return status < 500
      }
    };

    // Hit related API (passed axiosArgs as the argument) and manage the response
    await axios(axiosArgs)
    .then(response => {
      if (response.status === 200) {
        // Set some props related to problem collection page and edit problem page
        store.setState({
          // Problem collection page
          problemCollectionTopic: "Semua Topik",
          problemCollectionLevel: "Semua Level",
          problemCollectionPage: 1,
          currentPage: "problem-collection-page",

          // Edit problem page props
          editProblemType: "Isian Singkat",
          editProblemTypeOriginal: "Isian Singkat",
          editProblemLevel: "SBMPTN",
          editProblemLevelOriginal: "SBMPTN",
          editProblemTopic: "",
          editProblemContent: "",
          editProblemContentPreview: "",
          editProblemAnswer: "",
          editProblemSolution: "",
          editProblemSolutionPreview: "",
          editProblemFirstOption: "",
          editProblemSecondOption: "",
          editProblemThirdOption: "",
          editProblemFourthOption: ""
        })

        // Give success message
        Swal.fire({
          title: 'Sukses',
          text: 'Berhasil mengedit soal',
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
      editProblemContentPreview: this.props.editProblemContent
    })
  }

  /**
   * The following method is designed to show the preview of solution
   */
  previewSolution = () => {
    // Set the solution preview props the same as solution props
    store.setState({
      editProblemSolutionPreview: this.props.editProblemSolution
    })
  }
  
  /**
   * The following method is designed to handle cancel button
   */
  cancelButton = async () => {
    // Set some props to the default
    store.setState({
      // Edit problem page props
      editProblemType: "Isian Singkat",
      editProblemTypeOriginal: "Isian Singkat",
      editProblemLevel: "SBMPTN",
      editProblemLevelOriginal: "SBMPTN",
      editProblemTopic: "",
      editProblemContent: "",
      editProblemContentPreview: "",
      editProblemAnswer: "",
      editProblemSolution: "",
      editProblemSolutionPreview: "",
      editProblemFirstOption: "",
      editProblemSecondOption: "",
      editProblemThirdOption: "",
      editProblemFourthOption: "",

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
   * The following method is designed to prepare any information needed before the edit problem page is 
   * rendered
   */
  componentDidMount = async () => {
    // Check whether the admin has already logged in or not
    if (this.props.isLogin) {
      /**
       * When admin has been logged in, hit related API to get all information needed to be shown in edit
       * problem page
       */
      // Get problem ID
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
        // Set the store using the data returned by the API
        store.setState({
          // Edit problem props
          editProblemId: response.data.id,
          editProblemType: response.data.problem_type,
          editProblemTypeOriginal: response.data.problem_type,
          editProblemLevel: response.data.level,
          editProblemLevelOriginal: response.data.level,
          editProblemTopic: response.data.topic,
          editProblemContent: response.data.content,
          editProblemContentPreview: response.data.content,
          editProblemAnswer: response.data.answer,
          editProblemSolution: response.data.solution,
          editProblemSolutionPreview: response.data.solution,
          editProblemFirstOption: response.data.first_option,
          editProblemSecondOption: response.data.second_option,
          editProblemThirdOption: response.data.third_option,
          editProblemFourthOption: response.data.fourth_option,
          
          // Problem collection props
          problemCollectionPage: 1,
          problemCollectionTopic: "Semua Topik",
          problemCollectionLevel: "Semua Level",

          // Current page props
          currentPage: "problem-detail-page"
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
   * The following method is designed to render the view of edit problem page
   */
  render() {    
    // Convert preview string into jsx latex form
    let contentPreview = this.convertToLatex(this.props.editProblemContentPreview);
    let solutionPreview = this.convertToLatex(this.props.editProblemSolutionPreview);

    // Reorder level list so that the problem's level will appear at top
    let availableLevels = this.props.availableLevels;
    let levelListLength = availableLevels.length;
    let problemLevelIndex = 0;
    for (let index = 0; index < levelListLength; index++) {
      if (availableLevels[index] === this.props.editProblemLevelOriginal) {
        problemLevelIndex = index;
        break;
      }
    }
    availableLevels.splice(problemLevelIndex, 1);
    availableLevels.unshift(this.props.editProblemLevelOriginal);
    
    // Define a jsx variable that will provide all levels available
    availableLevels = availableLevels.map(level => {
        return (
          <option value = {level}>{level}</option>
        )
      })

    // Return the view of edit problem page
    return (
      <React.Fragment>
        <div className = "container">
          <div className = "row">
            <div className = "col-12 add-problem-title-container">
              HALAMAN UBAH SOAL<br /><span className = "edit-problem-id">Problem ID : {this.props.editProblemId}</span>
            </div>
            <div className = "col-12 add-problem-form-container">
              <form className = "form-group" onSubmit = {e => e.preventDefault(e)}>
                <div className = "container-fluid">
                  <div className = "row">
                    <div className = "col-12 add-problem-first-layer">
                      <input value = {this.props.editProblemTopic} onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-first-layer-input" type = "text" name = "editProblemTopic" placeholder = "Topik"/>
                      <span>* Jika topik lebih dari satu, pisahkan dengan tanda koma</span>
                      <select onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-first-layer-input" name = "editProblemLevel">
                        {availableLevels}
                      </select>
                      <select onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-first-layer-input" name = "editProblemType">
                        {
                          this.props.editProblemTypeOriginal === "Isian Singkat" ?
                          <React.Fragment>
                            <option value = "Isian Singkat">Isian Singkat</option>
                            <option value = "Pilihan Ganda">Plihan Ganda</option>
                          </React.Fragment>:
                          <React.Fragment>
                            <option value = "Pilihan Ganda">Pilihan Ganda</option>
                            <option value = "Isian Singkat">Isian Singkat</option>
                          </React.Fragment>
                        }
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
                            <textarea value = {this.props.editProblemContent} onChange = {(e) => this.props.handleOnChange(e)} className = "form-control" id = "problem-content" name = "editProblemContent"></textarea>
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
                            <textarea value = {this.props.editProblemSolution} onChange = {(e) => this.props.handleOnChange(e)} className = "form-control" id = "problem-solution" name = "editProblemSolution"></textarea>
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
                            <input value = {this.props.editProblemAnswer} onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer" type = "text" name = "editProblemAnswer" placeholder = "Jawaban"/>
                            <input value = {this.props.editProblemFirstOption} onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer" type = "text" name = "editProblemFirstOption" placeholder = "Pilihan 1"/>
                          </div>
                          <div className = "col-12 col-md-3 add-problem-option-container">
                            <input value = {this.props.editProblemSecondOption} onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer add-problem-input-other-option" type = "text" name = "editProblemSecondOption" placeholder = "Pilihan 2"/>
                          </div>
                          <div className = "col-12 col-md-3 add-problem-option-container">
                            <input value = {this.props.editProblemThirdOption} onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer add-problem-input-other-option" type = "text" name = "editProblemThirdOption" placeholder = "Pilihan 3"/>
                          </div>
                          <div className = "col-12 col-md-3 add-problem-option-container">
                            <input value = {this.props.editProblemFourthOption} onChange = {(e) => this.props.handleOnChange(e)} className = "form-control add-problem-input-option-answer add-problem-input-other-option" type = "text" name = "editProblemFourthOption" placeholder = "Pilihan 4"/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className = "col-12 add-problem-fifth-layer">
                      <button onClick = {() => this.cancelButton()} className = "btn btn-danger">Batal</button>
                      <button onClick = {() => this.editProblem()} className = "btn btn-primary" type = "submit">Simpan</button>
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
let editProblemPageProps = "editProblemId, editProblemType, editProblemTypeOriginal, editProblemLevel, editProblemLevelOriginal, editProblemTopic, editProblemContent, editProblemContentPreview, editProblemAnswer, editProblemSolution, editProblemSolutionPreview, editProblemFirstOption, editProblemSecondOption, editProblemThirdOption, editProblemFourthOption, ";
let problemCollectionPageProps = "problemCollectionPage, problemCollectionMaxPage, problemCollectionTotalProblems, problemCollectionTopic, problemCollectionLevel, problemCollection, ";

export default connect(
    editProblemPageProps + problemCollectionPageProps + "isLogin, baseUrl, currentPage, availableLevels", actions
  )(withRouter(EditProblemPage));