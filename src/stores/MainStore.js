// Import from third party
import createStore from "unistore";
import axios from "axios";
import Swal from "sweetalert2";

// Define all variable needed to be used globally
const initialState = {
  // Base URL for backend API
  baseUrl: "http://localhost:5000/",
  
  // Login related
  username: "",
  password: "",
  isLogin: false
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
  }
});
