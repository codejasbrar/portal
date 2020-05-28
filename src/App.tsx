import React, {ReactElement} from 'react';

import {BrowserRouter as Router, Switch, Route, useHistory, Redirect, useLocation} from 'react-router-dom';
import {RouteProps} from 'react-router';


//Styles
import "normalize.css/normalize.css";
import "./styles/global.scss";

let loggedIn = false;

const App = () =>
  <Router>
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/login" component={Login} />
      <PrivateRoute props={{path: "/inner"}}>
        <Route path="/inner" component={Inner} />
      </PrivateRoute>
    </Switch>
  </Router>;

export default App;

type PrivateRoutePropsTypes = {
  children: ReactElement,
  props: RouteProps
}

const Main = () => {
  return <h1>Hello, Physicains!</h1>
}

const Inner = () => {
  return <h1>Inner page content</h1>;
};

const Login = () => {
  let history = useHistory();
  let location = useLocation();

  let {from}: any = location.state || {from: {pathname: "/"}};
  let login = () => {
    loggedIn = true;
    history.replace(from);
  };

  return (
    <div>
      <p>Page {from.pathname.slice(1)} is private, please log in</p>
      <button onClick={login}>Log in</button>
    </div>
  );
};

const PrivateRoute = ({children, props}: PrivateRoutePropsTypes) =>
  <Route {...props} render={({location}) => loggedIn ? (children) :
    <Redirect to={{pathname: '/login', state: {from: location}}} />} />;
