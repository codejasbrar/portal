import React, {useEffect, useState} from 'react';

//Styles
import "normalize.css/normalize.css";
import "./styles/global.scss";

//Components
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Header from "./components/Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {loggedIn} from "./selectors/selectors";
import {loadUserByToken} from "./actions/userActions";
import Footer from "./components/Footer/Footer";
import Authentication from "./pages/Authentication/Authentication";
import Spinner from "./components/Spinner/Spinner";
import OrdersPage from "./pages/OrdersPages/OrdersPages";
import Token from "./helpers/localToken";
import {refreshTokenAction} from "./actions/authActions";
import LabSlipPage from "./pages/Labslip/LabSlipPage";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(loggedIn);

  useEffect(() => {
    (async () => {
      const tokenData = Token.get();
      if (tokenData.token) {
        if (Token.isTokenExpired()) {
          await dispatch(refreshTokenAction(tokenData.refreshToken as string));
          await dispatch(loadUserByToken());
        } else {
          await dispatch(loadUserByToken());
        }
      }
      setLoading(false);
    })();
  }, [dispatch, isLoggedIn]);


  return <Router>
    <Header />
    {loading && <Spinner />}
    <Switch>
      <Route exact path="/">
        <Redirect to="/orders/pending" />
      </Route>
      <Route path="/authentication"
        render={() => (isLoggedIn ? <Redirect to="/orders/pending" /> : <Authentication />)} />
      <PrivateRoute path='/orders' component={OrdersPage} />
      <PrivateRoute path='/labslip' component={LabSlipPage} adminOnly />
    </Switch>
    <Footer />
  </Router>
};

export default App;
