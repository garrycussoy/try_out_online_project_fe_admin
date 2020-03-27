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
import searchIcon from "../images/search.png";
import previous from "../images/back.png";
import next from "../images/next.png";

// Import from other modules
import Header from "../components/Header";

/**
 * The following class is desingned to handle everything related to Problem Collection page
 */
class ProblemCollectionPage extends React.Component {
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
    this.props.history.push('/problem/add');
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
              <div className = "col-md-6 col-12"></div>
              <div className = "col-12 each-problem-statement">
                <Latex>{problem.content}</Latex>     
              </div>
              <div className = "col-12">
                <span className = "each-answer">Jawaban : <Latex>{problem.answer}</Latex></span><br />
                {problem.first_option != null ?
                  <span className = "each-other-option">Pilihan 1 : <Latex>{problem.first_option}</Latex><br /></span>:
                  <span></span>
                }
                {problem.second_option != null ?
                  <span className = "each-other-option">Pilihan 2 : <Latex>{problem.second_option}</Latex><br /></span>:
                  <span></span>
                }
                {problem.third_option != null ?
                  <span className = "each-other-option">Pilihan 3 : <Latex>{problem.third_option}</Latex><br /></span>:
                  <span></span>
                }
                {problem.fourth_option != null ?
                  <span className = "each-other-option">Pilihan 4 : <Latex>{problem.fourth_option}</Latex><br /></span>:
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

export default connect(
  "problemCollection, problemCollectionTotalProblems, availableTopics, availableLevels, problemCollectionPage, problemCollectionMaxPage, problemCollectionTopic, problemCollectionLevel, isLogin, baseUrl, currentPage", actions
)(withRouter(ProblemCollectionPage));
