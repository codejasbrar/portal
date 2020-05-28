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
  return <h1>Hello, Physicians!</h1>
}

const Inner = () => {
  return <h1>Inner page content</h1>;
};

type LocationStatePropsTypes = {
  state: {
    from: string
  }
}

const Login = () => {
  const history = useHistory();
  const location: LocationStatePropsTypes = useLocation();

  const login = () => {
    loggedIn = true;
    history.replace(location.state && location.state.from ? location.state.from : '/');
  };

  return (
    <div>
      <p>Page is private, please log in</p>
      <button onClick={login}>Log in</button>
    </div>
  );
};

const PrivateRoute = ({children, props}: PrivateRoutePropsTypes) =>
  <Route {...props} render={({location}): ReactElement => loggedIn ? (children) :
    <Redirect to={{pathname: '/login', state: {from: location}}} />} />;
