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
  currentPage: "problem-collection-page",

  // Problem collection page
  problemCollectionPage: 1,
  problemCollectionTopic: "Semua Topik",
  problemCollectionLevel: "Semua Level",
  problemCollection: []
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
