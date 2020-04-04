// Import from third party
import createStore from "unistore";
import axios from "axios";
import Swal from "sweetalert2";

// Define all variable needed to be used globally
const initialState = {
  // Base URL for backend API
  baseUrl: "http://localhost:5000/",
  
  // General props than often used accross pages
  availableTopics: [],
  availableLevels: ["SBMPTN", "Olimpiade SMA", "Olimpiade SMP"],

  // Login related
  username: "",
  password: "",
  isLogin: true,

  // Everything related with header
  currentPage: "",

  // Problem collection page
  problemCollectionPage: 1,
  problemCollectionMaxPage: 1,
  problemCollectionTotalProblems: 0, 
  problemCollectionTopic: "Semua Topik",
  problemCollectionLevel: "Semua Level",
  problemCollection: [],

  // Problem detail page
  problemDetailId: 1,
  problemDetailType: "Isian Singkat",
  problemDetailLevel: "",
  problemDetailTopic: "",
  problemDetailContent: "",
  problemDetailAnswer: "",
  problemDetailSolution: "",
  problemDetailFirstOption: "",
  problemDetailSecondOption: "",
  problemDetailThirdOption: "",
  problemDetailFourthOption: "",

  // Add problem page
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

  // Edit problem page
  editProblemId: "",
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

  // Test collection page
  testCollection: [],
  testCollectionName: "",
  testCollectionKeyword: "",

  // Test detail page
  testDetailName: "",
  testDetailTimeLimit: "",
  testDetailSATotalProblems: 0,
  testDetailMCTotalProblems: 0,
  testDetailSACorrectScoring: 0,
  testDetailMCCorrectScoring: 0,
  testDetailSAWrongScoring: 0,
  testDetailMCWrongScoring: 0,
  testDetailMaximumScore: 0,
  testDetailDescription: "",
  testDetailProblems: [],

  // Edit test modal
  editTestName: "",
  editTestDescription: ""
};

export const store = createStore(initialState);

// Define all functions needed to be used globally
export const actions = store => ({
  /**
   * The following function is designed to handle change when user type in something in input form
   * @param {object} event Input taken from a form
   */
  handleOnChange: (state, event) => {
    store.setState({[event.target.name]: event.target.value})
  },

  /**
   * The following function is designed to handle logout section
   */
  handleLogout: (state) => {
    // Give success message
    Swal.fire({
      title: 'Logout berhasil',
      icon: 'success',
      timer: 3000,
      confirmButtonText: 'OK'
    })

    // Reset all props to default
    store.setState(initialState);

    // Remove token from local storage
    localStorage.removeItem("token");
  }
});
