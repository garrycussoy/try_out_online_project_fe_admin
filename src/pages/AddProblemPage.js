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

/**
 * The following class is desingned to handle everything related to Add Problem page
 */
class AddProblemPage extends React.Component {
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
                      <input className = "form-control add-problem-first-layer-input" type = "text" name = "addProblemTopic" placeholder = "Topik"/>
                      <span>* Jika topik lebih dari satu, pisahkan dengan tanda koma</span>
                      <select className = "form-control add-problem-first-layer-input" name = "addProblemLevel">
                        {availableLevels}
                      </select>
                      <select className = "form-control add-problem-first-layer-input" name = "addProblemType">
                        <option value = "Isian Singkat">Isian Singkat</option>
                        <option value = "Isian Singkat">Plihan Ganda</option>
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
                            <textarea className = "form-control" id = "problem-content" name = "addProblemContent"></textarea>
                          </div>
                          <div className = "col-md-6 col-12 add-problem-preview">
                            <label for = "problem-content-preview">Pratinjau Soal</label>
                            <p id = "problem-content-preview" className = "add-problem-content-preview">
                              <Latex></Latex>
                            </p>
                          </div>
                          <div className = "col-12 add-problem-preview-button">
                            <button className = "btn btn-primary" type = "submit">Tinjau Soal</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className = "col-12 add-problem-third-layer">
                      <div className = "container-fluid">
                        <div className = "row">
                          <div className = "col-md-6 col-12 add-problem-text-area">
                            <label for = "problem-solution">Solusi Lengkap</label>
                            <textarea className = "form-control" id = "problem-solution" name = "addProblemSolution"></textarea>
                          </div>
                          <div className = "col-md-6 col-12 add-problem-preview">
                            <label for = "problem-solution-preview">Pratinjau Solusi</label>
                            <p id = "problem-solution-preview" className = "add-problem-solution-preview">
                              <Latex></Latex>
                            </p>
                          </div>
                          <div className = "col-12 add-problem-preview-button">
                            <button className = "btn btn-primary" type = "submit">Tinjau Solusi</button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className = "col-12 add-problem-fourth-layer">
                      
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

export default connect(
    "isLogin, baseUrl, currentPage, availableLevels, problemCollectionPage, problemCollectionTopic, problemCollectionLevel", actions
  )(withRouter(AddProblemPage));