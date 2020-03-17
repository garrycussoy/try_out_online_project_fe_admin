// Import from third party
import createStore from "unistore";
import axios from "axios";
import Swal from "sweetalert2";

// Define all variable needed to be used globally
const initialState = {
  username: ""
};

export const store = createStore(initialState);

// Define all functions needed to be used globally
export const actions = store => ({});
