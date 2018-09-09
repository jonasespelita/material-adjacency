import React, { Component, Fragment } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Sidebar from "./Sidebar";
import AppNavbar from "./AppNavbar";
// import Main from "./Main";
import Machine from "./Machine"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: "machine"
    };
  }
  render() {
    const state = this.state;


    // quick router. sue me.
    let curPage;
    switch (state.page) {
      case "machine":
        curPage = <Machine />;
        break;
      default:
        curPage = (
          <main role="main" className="col-md-10 ml-sm-auto col-lg-10">
            <h1>I am lost...</h1>
          </main>
        );
    }

    return (
      <Fragment>
        <AppNavbar />
        <div className="container-fluid">
          <div className="row">
            <Sidebar />
            {curPage}
          </div>
        </div>
      </Fragment>
    );
  }
}

export default App;
