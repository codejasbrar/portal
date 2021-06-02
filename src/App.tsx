import React, {useEffect} from 'react';

//Styles
import "normalize.css/normalize.css";
import "./styles/global.scss";

//Components
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Authentication from "./pages/Authentication/Authentication";
import Spinner from "./components/Spinner/Spinner";
import OrdersPage from "./pages/OrdersPages/OrdersPages";
import Token from "./helpers/localToken";
import LabSlipPage from "./pages/Labslip/LabSlipPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";
import {observer} from "mobx-react";
import UserStore from "./stores/UserStore";
import AuthStore from "./stores/AuthStore";
import LoadingStore from "./stores/LoadingStore";


const App = observer(() => {
  const {loggedIn, refreshToken, setLoggedIn, tokenRefreshTried, setRefreshTried} = AuthStore;
  const {loadUserByToken} = UserStore;
  const {loading, entrypoint} = LoadingStore;

  useEffect(() => {
    const tokenData = Token.get();
    if (tokenData.token) {
      if (Token.isTokenExpired()) {
        refreshToken(tokenData.refreshToken as string);
        loadUserByToken();
      } else {
        setLoggedIn();
        loadUserByToken();
      }
    } else {
      setRefreshTried();
    }
  }, [loggedIn]);

  if (!tokenRefreshTried) return <Spinner />

  return <Router>
    <Header />
    {loading && <Spinner />}
    <Switch>
      <Route exact path="/">
        <Redirect to="/orders/pending" />
      </Route>
      <Route path="/authentication"
        render={() => (loggedIn ? <Redirect to={entrypoint ?? "/"} /> : <Authentication />)} />
      <PrivateRoute path='/orders' component={OrdersPage} />
      <PrivateRoute path='/labslip' component={LabSlipPage} adminOnly />
    </Switch>
    <Footer />
  </Router>
});

export default App;
