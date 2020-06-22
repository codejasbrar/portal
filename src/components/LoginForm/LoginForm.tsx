import React, {SyntheticEvent, useEffect, useState} from "react";

//Styles
import styles from "./LoginForm.module.scss";

//Components
import {useDispatch, useSelector} from "react-redux";
import {Link, useHistory} from "react-router-dom";
import {logIn} from "../../actions/authActions";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Checkbox from "../Checbox/Checkbox";
import {authState, loading} from "../../selectors/selectors";
import Spinner from "../Spinner/Spinner";
import ValidateFields from "../../helpers/validateFields";


const LoginForm = () => {

  const dispatch = useDispatch();
  const auth = useSelector((store: Storage) => ({...authState(store)}));
  const isLoading = useSelector((store: Storage) => (loading(store)));
  const history = useHistory();
  const storedPassword = localStorage.getItem('password');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [password, setPassword] = useState(storedPassword ? secret.decode(storedPassword) : '');
  const [remember, setRemember] = useState(!!localStorage.getItem('remember'));
  const [localError, setLocalError] = useState('');

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const validation = ValidateFields([{
      name: "Email",
      type: "email",
      value: username
    }, {
      name: "Password",
      type: "text",
      value: password
    }]);
    setLocalError(validation.message);
    if (!validation.valid) return;
    dispatch(logIn({username, password}));
    remember ? rememberCredentials() : removeCredentials();
  };

  const rememberCredentials = () => {
    localStorage.setItem('username', username);
    localStorage.setItem('password', secret.encode(password));
    localStorage.setItem('remember', 'true');
  };

  const removeCredentials = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('password');
    localStorage.removeItem('remember');
  };

  useEffect(() => {
    if (auth.loggedIn) {
      history.replace("/inner");
    }
  }, [auth.loggedIn, history]);

  useEffect(() => {
    if (auth.tempData) {
      history.replace("/authentication/security-code")
    }
  }, [auth.tempData]);

  return <>
    {isLoading && <Spinner />}
    <form onSubmit={handleSubmit} className={styles.Form}>
      {!localError && auth.error && <span className={styles.FormError}>{auth.error.message}</span>}
      {localError && <span className={styles.FormError}>{localError}</span>}
      <Input placeholder="Email" autofocus name="username" value={username} onChange={setUsername} label="Email" />
      <Input placeholder="Password"
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        label="Password" />
      <div className={styles.Bottom}>
        <Checkbox name="remember" checked={remember} onChange={setRemember} label="Remember me" />
        <Link to="/authentication/recovery" className={styles.BottomLink}>Forgot password</Link>
      </div>
      <div className={styles.FormBtn}><Button type="submit">Log in now</Button></div>
    </form>
  </>
};

export default LoginForm;

const secret = {
  passphrase: 'h1dem3',
  encode: function (password: string) {
    return btoa(password + this.passphrase)
  },
  decode: function (password: string) {
    const decodedPass = atob(password);
    return decodedPass.slice(0, decodedPass.indexOf(this.passphrase));
  }
};

