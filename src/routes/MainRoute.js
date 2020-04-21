// Import from standard libraries
import React from "react";
import { Route, Switch } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

// Import from third party
import { Provider } from "unistore/react";
import { store } from "../stores/MainStore";

// Import from other modules
import LoginPage from "../pages/LoginPage";
import ProblemCollectionPage from "../pages/ProblemCollectionPage";
import ProblemDetailPage from "../pages/ProblemDetailPage";
import AddProblemPage from "../pages/AddProblemPage";
import EditProblemPage from "../pages/EditProblemPage";
import TestCollectionPage from "../pages/TestCollectionPage";
import TestDetailPage from "../pages/TestDetailPage";
import AddTestPage from "../pages/AddTestPage";

/**
 * The following function is used for routing
 */
const Mainroute = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path = "/" component = {LoginPage} />
          <Route exact path = "/problem-collection" component = {ProblemCollectionPage} />
          <Route exact path = "/problem/detail/:problemId" component = {ProblemDetailPage} />
          <Route exact path = "/problem/add" component = {AddProblemPage} />
          <Route exact path = "/problem/edit/:problemId" component = {EditProblemPage} />
          <Route exact path = "/test-collection" component = {TestCollectionPage} />
          <Route exact path = "/test/detail/:testId" component = {TestDetailPage} />
          <Route exact path = "/test/add" component = {AddTestPage} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default Mainroute;
