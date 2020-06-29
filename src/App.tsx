import React, {ReactElement, useEffect, useState} from 'react';

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
import Main from "./pages/Main/Main";
import OrdersPage from "./pages/OrdersPages/OrdersPages";

import LabSlipApiService from "./services/LabSlipApiService";

new LabSlipApiService();

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(loggedIn);

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token')) {
        await dispatch(loadUserByToken());
      }
      setLoading(false);
    })();
  }, [dispatch, isLoggedIn]);

  return <Router>
    <Header />
    {loading && <Spinner />}
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/authentication" render={(props => (isLoggedIn ? <Redirect to="/" /> : <Authentication />))} />
      <PrivateRoute loggedIn={isLoggedIn || !!sessionStorage.getItem('token')}>
        <>
          <Route path={['/orders/pending', '/orders/approved', '/orders/test', '/orders/test-approved', '/orders/navigation']} component={OrdersPage} />
        </>
      </PrivateRoute>
    </Switch>
    <Footer />
  </Router>
};

export default App;

type PrivateRoutePropsTypes = {
  children: ReactElement,
  loggedIn: boolean
};


const PrivateRoute = ({children, loggedIn}: PrivateRoutePropsTypes) =>
  <Route render={({location}): ReactElement => loggedIn ? (children) :
    <Redirect to={{pathname: '/authentication', state: {from: location}}} />} />;
