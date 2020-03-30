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
import editIcon from "../images/edit.png";
import removeIcon from "../images/bin.png";
import previous from "../images/back.png";
import next from "../images/next.png";

// Import from other modules
import Header from "../components/Header";

/**
 * The following class is desingned to handle everything related to Problem Collection page
 */
class ProblemCollectionPage extends React.Component {
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
   * The following method is designed to handle search by topic in problem collection page
   */
  searchByTopic = async (event) => {
    /**
       * Hit related API to get all information needed to be shown in problem collection page (based on search
       * by topic inputted by admin)
       */
    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "get",
      url: this.props.baseUrl + "problem-collection",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      params: {
        page: this.props.problemCollectionPage,
        topic: event.target.value,
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
      store.setState({
        problemCollection: response.data.problems_list,
        problemCollectionTopic: response.data.topic_chosen,
        problemCollectionPage: 1,
        problemCollectionMaxPage: response.data.max_page,
        problemCollectionTotalProblems: response.data.total_problems
      })
    })
    .catch(error => {
      console.warn(error);
    });
  }
  
  /**
   * The following method is designed to handle search by level in problem collection page
   */
  searchByLevel = async (event) => {
    /**
       * Hit related API to get all information needed to be shown in problem collection page (based on search
       * by level inputted by admin)
       */
    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "get",
      url: this.props.baseUrl + "problem-collection",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      params: {
        page: this.props.problemCollectionPage,
        topic: this.props.problemCollectionTopic,
        level: event.target.value
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
        problemCollection: response.data.problems_list,
        problemCollectionLevel: response.data.level_chosen,
        problemCollectionPage: 1,
        problemCollectionMaxPage: response.data.max_page,
        problemCollectionTotalProblems: response.data.total_problems
      })
    })
    .catch(error => {
      console.warn(error);
    });
  }

  /**
   * The following method is designed to redirect the page to add problem page
   */
  addProblemButton = () => {
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
      currentPage: "add-problem-page"
    })

    // Redirect to add problem page
    this.props.history.push('/problem/add');
  }

  /**
   * The following method is designed to look the detail of selected problem
   * @param {int} problemId ID of selected problem
   */
  problemDetailButton = (problemId) => {
    // Set some props
    store.setState({
      currentPage: "problem-detail-page"
    })
    // Redirect to problem collection page
    this.props.history.push('/problem/detail/' + problemId)
  }

  /**
   * The following method is designed to redirect the page into "Edit Problem" page
   * @param {int} problemId ID of selected problem
   */
  editProblemButton = (problemId) => {
    this.props.history.push('/problem/edit/' + problemId)
  }

  /**
   * The following method is designed to remove selected problem
   * @param {int} problemId ID of selected problem which will be removed
   */
  removeProblemButton = async (problemId) => {
    /**
       * Hit related API to remove selected problem
       */
    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "delete",
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
    .then(async (response) => {
      if (response.status === 200) {
        /**
         * Hit related API to get all information needed to be shown in problem collection page after removing
         * a problem
         */
        // Define object that will be passed as an argument to axios function
        const axiosArgs = {
          method: "get",
          url: this.props.baseUrl + "problem-collection",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          },
          params: {
            page: 1,
            topic: this.props.problemCollectionTopic,
            level: this.props.problemCollectionLevel
          },
          validateStatus: (status) => {
            return status < 500
          }
        };

        // Hit related API (passed axiosArgs as the argument) and manage the response
        await axios(axiosArgs)
        .then(async (response) => {
          // Set the store using the data returned by the API
          store.setState({
            problemCollection: response.data.problems_list,
            problemCollectionLevel: response.data.level_chosen,
            problemCollectionTopic: response.data.topic_chosen,
            problemCollectionPage: 1,
            problemCollectionMaxPage: response.data.max_page,
            problemCollectionTotalProblems: response.data.total_problems
          })

          // Give success message
          await Swal.fire({
            title: 'Berhasil',
            text: 'Soal dengan ID ' + problemId + ' telah terhapus',
            icon: 'success',
            timer: 3000,
            confirmButtonText: 'OK'
          })
        })
        .catch(error => {
          console.warn(error);
        });
      } else {
        // Give failure message
        await Swal.fire({
          title: 'Gagal Menghapus Soal',
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
   * The following method is designed to handle next button
   */
  nextButton = async () => {
    let currentPage = this.props.problemCollectionPage;
    let maxPage = this.props.problemCollectionMaxPage;
    currentPage = currentPage + 1;
    if (currentPage > maxPage) {
      currentPage = 1
    }
    /**
       * Hit related API to get all information needed to be shown in problem collection page
       */
    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "get",
      url: this.props.baseUrl + "problem-collection",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      params: {
        page: currentPage,
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
      store.setState({
        problemCollection: response.data.problems_list,
        problemCollectionLevel: response.data.level_chosen,
        problemCollectionTopic: response.data.topic_chosen,
        problemCollectionPage: currentPage,
        problemCollectionMaxPage: response.data.max_page,
        problemCollectionTotalProblems: response.data.total_problems
      })
    })
    .catch(error => {
      console.warn(error);
    });
  }
  
  /**
   * The following method is designed to handle previous button
   */
  previousButton = async () => {
    let currentPage = this.props.problemCollectionPage;
    let maxPage = this.props.problemCollectionMaxPage;
    currentPage = currentPage - 1;
    if (currentPage < 1) {
      currentPage = maxPage
    }
    /**
       * Hit related API to get all information needed to be shown in problem collection page
       */
    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "get",
      url: this.props.baseUrl + "problem-collection",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      params: {
        page: currentPage,
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
      store.setState({
        problemCollection: response.data.problems_list,
        problemCollectionLevel: response.data.level_chosen,
        problemCollectionTopic: response.data.topic_chosen,
        problemCollectionPage: currentPage,
        problemCollectionMaxPage: response.data.max_page,
        problemCollectionTotalProblems: response.data.total_problems
      })
    })
    .catch(error => {
      console.warn(error);
    });
  }

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
        params: {
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
        store.setState({
          problemCollection: response.data.problems_list,
          problemCollectionMaxPage: response.data.max_page,
          availableTopics: response.data.available_topics,
          problemCollectionTopic: response.data.topic_chosen,
          problemCollectionLevel: response.data.level_chosen,
          problemCollectionTotalProblems: response.data.total_problems,
          currentPage: "problem-collection-page"
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
   * The following method is used to render the view of problem collection page
   */
  render() {
    // Check whether admin has logged in or not
    if (!this.props.isLogin) {
      // Redirect to login page
      this.props.history.push("/login");
    }

    // Define some variables needed
    let problemCollection = this.props.problemCollection;
    let problemCollectionTopic = this.props.problemCollectionTopic;
    let problemCollectionLevel = this.props.problemCollectionLevel;
    let problemCollectionTotalProblems = this.props.problemCollectionTotalProblems;

    // Define a jsx variable that will be used to provide all topics available
    const availableTopics = this.props.availableTopics.map(topic => {
      return (
        <option value = {topic}>{topic}</option>
      )
    })

    // Define a jsx variable that will be used to provide all levels available
    const availableLevels = this.props.availableLevels.map(level => {
      return (
        <option value = {level}>{level}</option>
      )
    })

    // Define a jsx variable that will be used to provide all problems view in problem collection page
    problemCollection = problemCollection.map(problem => {
      return (
        <div className = "col-12 each-problem-container">
          <div className = "container-fluid">
            <div className = "row">
              <div className = "col-md-6 col-12 each-problem-information">
                <span>Problem ID {problem.id} ({problem.problem_type})</span><br />
                <span>Level : {problem.level}</span><br />
                <span>Topik : {problem.topic}</span>
              </div>
              <div className = "col-md-6 col-12 each-problem-icons">
                <img onClick = {() => this.problemDetailButton(problem.id)} src = {lookIcon} />
                <img onClick = {() => this.editProblemButton(problem.id)} src = {editIcon} />
                <img onClick = {() => this.removeProblemButton(problem.id)} src = {removeIcon} />
              </div>
              <div className = "col-12 each-problem-statement">
                {this.convertToLatex(problem.content)}     
              </div>
              <div className = "col-12">
                <span className = "each-answer">Jawaban : {this.convertToLatex(problem.answer)}</span><br />
                {problem.first_option !== "" ?
                  <span className = "each-other-option">Pilihan 1 : {this.convertToLatex(problem.first_option)}<br /></span>:
                  <span></span>
                }
                {problem.second_option !== "" ?
                  <span className = "each-other-option">Pilihan 2 : {this.convertToLatex(problem.second_option)}<br /></span>:
                  <span></span>
                }
                {problem.third_option !== "" ?
                  <span className = "each-other-option">Pilihan 3 : {this.convertToLatex(problem.third_option)}<br /></span>:
                  <span></span>
                }
                {problem.fourth_option !== "" ?
                  <span className = "each-other-option">Pilihan 4 : {this.convertToLatex(problem.fourth_option)}<br /></span>:
                  <span></span>
                }
              </div>
            </div>
          </div>
        </div>
      )
    })

    return (
      <React.Fragment>
        <Header />
        <div className = "container">
          <div className = "row second-header-container">
            <div className = "col-md-5 col-12 search-container">
              <form className = "form-inline" onSubmit = {e => e.preventDefault(e)}>
                <select onClick = {e => this.searchByTopic(e)} className = "form-control search-bar" name = "problemCollectionTopic">
                  <option value = "Semua Topik">Semua Topik</option>
                  {availableTopics}
                </select>
                <select onClick = {e => this.searchByLevel(e)} className = "form-control search-bar" name = "problemCollectionLevel">
                  <option value = "Semua Level">Semua Level</option>
                  {availableLevels}
                </select>
              </form>
            </div>
            <div className = "col-md-2 col-12 problem-collection-title-container">
              <span className = "problem-collection-title">KOLEKSI SOAL</span><br />
              <span className = "page-detail">{problemCollectionTopic}</span><br />
              <span className = "page-detail">{problemCollectionLevel}</span><br />
              <span className = "page-detail">Total : {problemCollectionTotalProblems} Soal</span><br />
            </div>
            <div className = "col-md-5 col-12 add-problem-button-container">
              <button onClick = {e => this.addProblemButton()} type = "submit" className = "btn btn-primary add-problem-button">Tambah Soal</button>
            </div>
          </div>
        </div>
        <div className = "container">
          <div className = "row">
            {problemCollection}
            <div className = "col-12 pagination-container">
              {this.props.problemCollection.length !== 0 ?
                <div className = "footer-container">
                  <img onClick = {() => this.previousButton()} src = {previous} className = "pagination-icon" />
                  <span className = "page-information">Halaman {this.props.problemCollectionPage} dari {this.props.problemCollectionMaxPage}</span>
                  <img onClick = {() => this.nextButton()} src = {next} className = "pagination-icon" />
                </div>:
                <div className = "problem-not-found-container">
                  <span className = "problem-not-found">Tidak ada soal yang memenuhi kriteria pencarian</span>
                </div>
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
};

// Define variables that will be passed to connect method as an argument
let addProblemPageProps = "addProblemType, addProblemLevel, addProblemTopic, addProblemContent, addProblemContentPreview, addProblemAnswer, addProblemSolution, addProblemSolutionPreview, addProblemFirstOption, addProblemSecondOption, addProblemThirdOption, addProblemFourthOption, ";
let problemCollectionPageProps = "problemCollectionPage, problemCollectionMaxPage, problemCollectionTotalProblems, problemCollectionTopic, problemCollectionLevel, problemCollection, ";

export default connect(
  problemCollectionPageProps + addProblemPageProps + "availableTopics, availableLevels, isLogin, baseUrl, currentPage", actions
)(withRouter(ProblemCollectionPage));
