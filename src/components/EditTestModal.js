// Import from standard libraries
import React from "react";
import { withRouter } from "react-router-dom";

// Import from thrid party libraries
import Swal from "sweetalert2";
import axios from "axios";
import { connect } from "unistore/react";
import { actions, store } from "../stores/MainStore";

// Import everything related to style
import "../styles/bootstrap.min.css";
import "../styles/main.css";

class EditTestModal extends React.Component {
  /**
   * The following method is designed to save editted test into database
   */
  editTestButton = async () => {
    // Get the parameter in URL
    let matchUrlArray = this.props.match.url.split("/");
    let matchUrlArrayLength = matchUrlArray.length;
    let testId = matchUrlArray[matchUrlArrayLength - 1];

    // Define object that will be passed as an argument to axios function
    const axiosArgs = {
      method: "put",
      url: this.props.baseUrl + "test/" + testId,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      data: {
        name: this.props.editTestName,
        description: this.props.editTestDescription
      },
      validateStatus: (status) => {
        return status < 500
      }
    };

    // Hit related API (passed axiosArgs as the argument) and manage the response
    await axios(axiosArgs)
    .then(async (response) => {
      if (response.status === 200) {
        // Set some props using editted information
        store.setState({
          // Edit test props
          editTestName: this.props.editTestName,
          editTestDescription: this.props.editTestDescription,

          // Test detail props
          testDetailName: this.props.editTestName,
          testDetailDescription: this.props.editTestDescription
        })

        // Give success message
        await Swal.fire({
          title: 'Sukses',
          text: 'Berhasil mengubah nama dan deskripsi paket tes',
          icon: 'success',
          timer: 3000,
          confirmButtonText: 'OK'
        })
      } else {
        // Give failure message
        await Swal.fire({
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
   * The following method is designed to render the view of edit test modal
   */
  render() {
    // Define some variables
    let testDetailName = this.props.editTestName;
    let testDetailDescription = this.props.editTestDescription;

    return (
      <React.Fragment>
        <div
          className = "modal fade"
          id = "editTest"
          data-backdrop = "static"
          tabindex = "-1"
          role = "dialog"
          aria-labelledby = "staticBackdropLabel"
          aria-hidden = "true"
        >
          <div className = "modal-dialog modal-dialog-centered" role = "document">
            <div className = "modal-content">
              <div className = "container">
                <div className = "row">
                  <div className = "col-1"></div>
                  <div className = "col-10 edit-test-header">
                    <h5 className = "edit-test-title" id = "staticBackdropLabel">Ubah Tes</h5>
                  </div>
                  <div className = "col-1"></div>
                </div>
              </div>
              <div className = "container">
                <div className = "row">
                  <div className = "col-1"></div>
                  <div className = "col-10 edit-test-container">
                    <span className = "edit-test-intro">Pada bagian ini, kamu hanya bisa mengubah nama dan deskripsi tes saja. Bagian lainnya tidak dapat diubah.</span>
                    <form className = "form-group" onSubmit = {e => e.preventDefault(e)}>
                      <input onChange = {(e) => this.props.handleOnChange(e)} name = "editTestName" value = {testDetailName} className = "form-control edit-test-name-input" type = "text" placeholder = "Nama Tes"></input><br />
                      <textarea onChange = {(e) => this.props.handleOnChange(e)} name = "editTestDescription" value = {testDetailDescription} className = "form-control edit-test-description-input" placeholder = "Deskripsi" resize = "none"></textarea><br />
                      <button class = "close" data-dismiss = "modal" aria-label = "Close" onClick = {() => this.editTestButton()} className = "btn btn-primary edit-test-button" type = "submit">Ubah</button>
                      <button class = "close" data-dismiss = "modal" aria-label = "Close" className = "btn btn-danger edit-test-button">Batal</button>
                    </form>
                  </div>
                  <div className = "col-1"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
};

export default connect(
    "isLogin, baseUrl, currentPage, editTestName, editTestDescription, testDetailName, testDetailDescription", actions
  )(withRouter(EditTestModal));