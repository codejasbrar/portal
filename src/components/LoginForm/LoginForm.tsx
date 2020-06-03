import React, {SyntheticEvent, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useLocation} from "react-router-dom";
import {logIn} from "../../actions/authActions";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Checkbox from "../Checbox/Checkbox";

//Styles
import styles from "./LoginForm.module.scss";
import {LoginError} from "../../services/AuthApiService";
import {authState} from "../../selectors/selectors";

type LoginFormPropsTypes = {
  title?: string,
  subtitle?: string
  error?: LoginError
};

type LocationStatePropsTypes = {
  state: {
    from: string
  }
};


const LoginForm = (props: LoginFormPropsTypes) => {
  const dispatch = useDispatch();
  const auth = useSelector((store: Storage) => ({...authState(store)}));
  const history = useHistory();
  const location: LocationStatePropsTypes = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);


  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(logIn({username, password}));
  };

  useEffect(() => {
    if (auth.loggedIn) {
      history.replace(location.state && location.state.from ? location.state.from : '/');
    }
  }, [auth.error]);

  return <form onSubmit={handleSubmit}>
    {auth.error && <span>{auth.error.message}</span>}
    <Input placeholder="Email" autofocus name="username" value={username} onChange={setUsername} label="Email" />
    <Input placeholder="Password"
      name="password"
      type="password"
      value={password}
      onChange={setPassword}
      label="Password" />
    <div className={styles.Bottom}>
      <Checkbox name="remember" checked={remember} onChange={setRemember} label="Remember me" />
    </div>
    <div className={styles.FormBtn}><Button type="submit">Log in now</Button></div>
  </form>
};

export default LoginForm;