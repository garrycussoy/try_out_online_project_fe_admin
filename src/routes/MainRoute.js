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

/**
 * The following function is used for routing
 */
const Mainroute = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path = "/login" component = {LoginPage} />
          <Route exact path = "/problem-collection" component = {ProblemCollectionPage} />
          <Route exact path = "/problem/detail/:problemId" component = {ProblemDetailPage} />
        </Switch>
      </BrowserRouter>
    </Provider>
  );
};

export default Mainroute;
