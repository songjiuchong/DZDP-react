import React, { Component } from "react";
import ErrorToast from "../../components/ErrorToast";
import { actions as appActions, getError } from "../../redux/modules/app";
import AsyncComponent from "../../utils/AsyncComponent";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "../PrivateRoute";

const Home = AsyncComponent(() => import("../Home"));
const Search = AsyncComponent(() => import("../Search"));
const Login = AsyncComponent(() => import("../Login"));
const ProductDetail = AsyncComponent(() => import("../ProductDetail"));
const SearchResult = AsyncComponent(() => import("../SearchResult"));
const User = AsyncComponent(() => import("../User"));
const Purchase = AsyncComponent(() => import("../Purchase"));

class App extends Component {
  render() {
    const {
      error,
      appActions: { clearError },
    } = this.props;
    return (
      <div className="App">
        <Router basename="/dianping">
          <Switch>
            <Route path="/Login" component={Login}></Route>
            <PrivateRoute path="/user" component={User}></PrivateRoute>
            <Route path="/detail/:id" component={ProductDetail}></Route>
            <Route path="/search" component={Search}></Route>
            <Route path="/search_result" component={SearchResult}></Route>
            <PrivateRoute path="/purchase/:id" component={Purchase}></PrivateRoute>
            <Route path="/" component={Home}></Route>
          </Switch>
        </Router>
        {error ? <ErrorToast msg={error} clearError={clearError} /> : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    error: getError(state),
  };
};

const mapDispatchoProps = (dispatch) => {
  return {
    appActions: bindActionCreators(appActions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchoProps)(App);
