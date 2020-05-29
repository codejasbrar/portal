import React, {ReactElement, useEffect, useState} from 'react';

//Styles
import "normalize.css/normalize.css";
import "./styles/global.scss";

//Components
import {BrowserRouter as Router, Switch, Route, useHistory, Redirect, useLocation} from 'react-router-dom';
import {RouteProps} from 'react-router';
import Header from "./components/Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {logIn} from "./actions/authActions";
import {authStateToProps, userStateToProps} from "./selectors/selectors";
import {loadUserByToken} from "./actions/userActions";
import {User} from "./interfaces/User";
import {AuthState} from "./interfaces/AuthState";

const App = () => {
  //const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector((store: Storage): AuthState => ({...authStateToProps(store)}));

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      loadUserByToken(dispatch);
    }
  }, []);

  return <Router>
    <Header />
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/login" component={Login} />
      <PrivateRoute props={{path: "/inner"}} loggedIn={auth.loggedIn || !!sessionStorage.getItem('token')}>
        <Route path="/inner" component={Inner} />
      </PrivateRoute>
    </Switch>
  </Router>
};

export default App;

type PrivateRoutePropsTypes = {
  children: ReactElement,
  props: RouteProps,
  loggedIn: boolean
}

const Main = () => {
  return <h1>Hello, Physicians!</h1>
}

const Inner = () => {
  const user: User = useSelector((store: Storage) => ({...userStateToProps(store)}));
  return <h1>Welcome back, {user.first_name} {user.last_name}</h1>;
};

type LocationStatePropsTypes = {
  state: {
    from: string
  }
}

const Login = () => {
  const history = useHistory();
  const location: LocationStatePropsTypes = useLocation();
  const dispatch = useDispatch();

  const login = () => {
    logIn(dispatch);
    loadUserByToken(dispatch);
    history.replace(location.state && location.state.from ? location.state.from : '/');
  };

  return (
    <div>
      <p>Page is private, please log in</p>
      <button onClick={login}>Log in</button>
    </div>
  );
}

const PrivateRoute = ({children, props, loggedIn}: PrivateRoutePropsTypes) =>
  <Route {...props} render={({location}): ReactElement => loggedIn ? (children) :
    <Redirect to={{pathname: '/login', state: {from: location}}} />} />;
