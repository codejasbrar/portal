import React, {SyntheticEvent, useEffect, useState} from "react";

//Styles
import styles from "./LoginForm.module.scss";

//Components
import {Link, useHistory} from "react-router-dom";
import Input from "../Input/Input";
import Button from "../Button/Button";
import Checkbox from "../Checbox/Checkbox";
import Spinner from "../Spinner/Spinner";
import ValidateFields from "../../helpers/validateFields";
import AuthStore from "../../stores/AuthStore";


const LoginForm = (props: { logout?: boolean }) => {
  const {error, isLoading, loggedIn, tempData, login, clearError} = AuthStore;
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
    login({username, password});
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
    if (loggedIn) {
      history.replace("/");
    }
  }, [loggedIn, history]);


  useEffect(() => {
    if (tempData) {
      history.replace("/authentication/security-code")
    }
  }, [tempData, history]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const authErrorReplaced = error && error.message === 'Invalid credentials' ?
    'Username and password combination is incorrect. Please try again.'
    : error?.message

  return <>
    {isLoading && <Spinner />}
    <form
      onSubmit={handleSubmit}
      className={styles.Form}>
      {!localError && error && <span className={styles.FormError}>{authErrorReplaced}</span>}
      {localError && <span className={styles.FormError}>{localError}</span>}
      <Input
        placeholder="Email"
        autofocus name="username"
        value={username}
        onChange={setUsername}
        label="Email"
        type="email"
      />
      <Input
        placeholder="Password"
        name="password"
        type="password"
        value={password}
        onChange={setPassword}
        label="Password"
      />
      <div className={styles.Bottom}>
        <Checkbox
          name="remember"
          checked={remember}
          onChange={setRemember}
          label="Remember me"
        />
        <Link
          to="/authentication/recovery"
          className={styles.BottomLink}>
          Forgot password
        </Link>
      </div>
      <div className={styles.FormBtn}>
        <Button type="submit">
          {props.logout ? 'Log in now' : 'Log in'}
        </Button>
      </div>
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
