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
import cancelIcon from "../images/cancel.png";
import tickIcon from "../images/tick.png";

// Import from other modules
import Header from "../components/Header";

/**
 * The following class is desingned to handle everything related to Test Detail page
 */
class TestDetailPage extends React.Component {
  /**
   * The following method is used to render the view of test detail page
   */
  render() {
    // Define jsx variables that will generate all problems of the test
    let problems = (
      <table className = "table table-bordered test-detail-problem-table">
        <thead>
          <tr>
            <th className = "cell-fix-width-100">Nomor</th>
            <th className = "cell-fix-width-100">Problem ID</th>
            <th>Tipe</th>
            <th>Level</th>
            <th className = "cell-min-width-200">Topik</th>
          </tr>
          {
            this.props.testDetailProblems.map((problem, order) => {
              return (
                <tr>
                  <td>{order + 1}</td>
                  <td>VARIABLE</td>
                  <td>VARIABLE</td>
                  <td>VARIABLE</td>
                  <td>VARIABLE</td>
                </tr>
              )
            })
          }
        </thead>
      </table>
    )

    // Return the view of test detail page
    return (
      <React.Fragment>
        <Header />
        <div className = "container">
          <div className = "row">
            <div className = "col-12 test-detail-header">
              <span className = "test-detail-title">VARIABLE NAMA UJIAN</span><br />
              <span className = "test-detail-time-limit">Waktu Pengerjaan : VARIABLE Menit</span>
            </div>
            <div className = "col-md-3 col-12"></div>
            <div className = "col-md-6 col-12 test-detail-characteristic-container">
              <table className = "table table-bordered characteristic-table">
                <thead>
                  <tr>
                    <th>Tipe</th>
                    <th>Total Soal</th>
                    <th>Skor Benar</th>
                    <th>Skor Salah</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Isian Singkat</td>
                    <td>VARIABLE</td>
                    <td>VARIABLE</td>
                    <td>VARIABLE</td>
                  </tr>
                  <tr>
                    <td>Pilihan Ganda</td>
                    <td>VARIABLE</td>
                    <td>VARIABLE</td>
                    <td>VARIABLE</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className = "col-md-3 col-12"></div>
            <div className = "col-12 characterisctic-container-bottom-border">
              Skor Maksimal : VARIABLE
            </div>
            <div className = "col-12 test-detail-description-container">
              <span className = "test-detail-description">Deskripsi</span>
              <div className = "test-detail-description-box">VARIABLE VARIABLE VARIABLE</div>
            </div>
          </div>
          <div className = "col-12 test-detail-problem-table-container">
            {problems}
          </div>
          <div className = "col-12 test-detail-button-container">
            <button className = "btn btn-primary test-detail-button">Ubah</button>
            <button className = "btn btn-danger test-detail-button">Hapus</button>
            <button className = "btn btn-primary test-detail-button">Kembali</button>
          </div>
        </div>
      </React.Fragment>
    )
  }
};

// Define variables that will be passed to connect method as an argument
let testCollectionPageProps = "testCollection, testCollectionName, testCollectionKeyword, ";
let testDetailPageProps = "testDetailName, testDetailTimeLimit, testDetailSATotalProblems, testDetailMCTotalProblems, testDetailSACorrectScoring, testDetailMCCorrectScoring, testDetailSAWrongScoring, testDetailMCWrongScoring, testDetailMaximumScore, testDetailDescription, testDetailProblems, ";

export default connect(
  testCollectionPageProps + testDetailPageProps + "isLogin, baseUrl, currentPage", actions
)(withRouter(TestDetailPage));
