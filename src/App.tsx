import React, {ReactElement, useEffect, useState} from 'react';

//Styles
import "normalize.css/normalize.css";
import "./styles/global.scss";

//Components
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Header from "./components/Header/Header";
import {useDispatch, useSelector} from "react-redux";
import {authState, userState} from "./selectors/selectors";
import {loadUserByToken} from "./actions/userActions";
import {User} from "./interfaces/User";
import {AuthState} from "./interfaces/AuthState";
import Footer from "./components/Footer/Footer";
import Login from "./pages/Login/Login";
import Spinner from "./components/Spinner/Spinner";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const auth = useSelector((store: Storage): AuthState => ({...authState(store)}));
  const user = useSelector((store: Storage): User => ({...userState(store)}));

  useEffect(() => {
    (async () => {
      if (localStorage.getItem('token') && !Object.keys(user).length) {
        await dispatch(loadUserByToken());
      }
      setLoading(false);
    })();
  }, [dispatch, user]);

  console.log(2);

  return <Router>
    <Header />
    <Spinner show={loading} />
    <Switch>
      <Route exact path="/" component={Main} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={() => <Login mode="logout" />} />
      <PrivateRoute loggedIn={auth.loggedIn || !!sessionStorage.getItem('token')}>
        <Route path="/inner" component={Inner} />
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

const Main = () => {
  return <h1>Hello, Physicians!</h1>
};

const Inner = () => {
  const user: User = useSelector((store: Storage) => ({...userState(store)}));
  return <h1>Welcome back, {user.first_name} {user.last_name}</h1>;
};

const PrivateRoute = ({children, loggedIn}: PrivateRoutePropsTypes) =>
  <Route render={({location}): ReactElement => loggedIn ? (children) :
    <Redirect to={{pathname: '/login', state: {from: location}}} />} />;
