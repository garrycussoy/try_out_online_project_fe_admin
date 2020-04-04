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
 * The following class is desingned to handle everything related to Add Test page
 */
class AddTestPage extends React.Component {
  /**
   * The following method is designed to render the view of add test page
   */
  render() {    
    // Return the view of add problem page
    return (
      <React.Fragment>
        <div className = "container">
          <div className = "row">
            <div className = "col-12 add-test-header-container">
              HALAMAN TAMBAH TEST
            </div>
          </div>
        </div>
        <form className = "form-group" onSubmit = {e => e.preventDefault(e)}>
          <div className = "container">
            <div className = "row">
              <div className = "col-12 add-test-first-layer">
                <input className = "form-control first-type-input" placeholder = "Nama Tes" name = "addTestName"></input>
                <label><input className = "checkbox-type-input checkbox-inline" type = "checkbox" value = {true}/>Centang untuk menampilkan tes ini di halaman pengguna</label><br />
                <span className = "add-test-description">Deskripsi</span><br />
                <textarea className = "form-control textarea-type-input" name = "addTestDescription"></textarea><br />
                <input className = "form-control first-type-input" placeholder = "Batas Waktu" name = "addTestTimeLimit"></input>
                <span>Masukkan dalam menit (harus bilangan bulat positif)</span><br />
                <span className = "add-test-sub-header-left">Isian Singkat</span>
                <span className = "add-test-description">Pilihan Ganda</span><br />
                <input className = "form-control second-type-input" placeholder = "Skor Benar" name = "addTestSACorrectScoring"></input>
                <input className = "form-control second-type-input" placeholder = "Skor Salah" name = "addTestSAWrongScoring"></input>
                <input className = "form-control second-type-input" placeholder = "Skor Benar" name = "addTestMCCorrectScoring"></input>
                <input className = "form-control second-type-input" placeholder = "Skor Salah" name = "addTestMCWrongScoring"></input><br />
                <span>Skor benar dan skor salah harus berupa bilangan bulat</span>
              </div>
            </div>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

// Define variables that will be passed to connect method as an argument

export default connect(
    "isLogin, baseUrl, currentPage, availableLevels", actions
  )(withRouter(AddTestPage));




  {/* <div className = "col-12 add-problem-form-container">
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
            </div> */}