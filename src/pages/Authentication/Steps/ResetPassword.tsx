import React, {useEffect, useState} from "react";
import {useLocation, useHistory} from "react-router-dom";
import searchToObject from "../../../helpers/searchToObject";
import {useDispatch} from "react-redux";
import {Link} from "react-router-dom";

//Styles
import styles from "../../../components/LoginForm/LoginForm.module.scss";

//Components
import ValidateFields from "../../../helpers/validateFields";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import {loadUserByToken} from "../../../actions/userActions";

const ResetPassword = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const searchStringParams = searchToObject(location.search);

  useEffect(() => {
    console.log(searchStringParams);
    if (searchStringParams && searchStringParams.token) {
      dispatch(loadUserByToken());
    } else {
      history.replace('/authentication')
    }
  }, []);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = ValidateFields([{name: "Password", type: "password", value: password}, {
      name: "Reset password",
      type: "text",
      value: confirmation
    }]);
    setLocalError(validation.message);
    if (!validation.valid) return;
    if (password !== confirmation) {
      setLocalError("Passwords didn't match");
      return;
    }
    setSubmitted(true);
  };

  return <div className={`${styles.FormWrapper} ${styles.ResetPassword}`}>
    <p className={styles.FormTitle}>{submitted ? 'Your password was updated!' : 'Reset your password'}</p>
    <p className={`${styles.FormSubtitle} ${styles.ResetPasswordSubtitle}`}>{submitted ? 'You can now log in to your account with your new password.' : 'Must be a minimum of 8 characters, and must contain at least one number.'}</p>
    {!submitted && <form className={`${styles.Form} ${styles.ResetPasswordForm}`} onSubmit={onFormSubmit}>
      {/*{!localError && auth.error && <span className={styles.FormError}>{auth.error.message}</span>}*/}
      {localError && <span className={styles.FormError}>{localError}</span>}
      <Input value={password}
        onChange={setPassword}
        name="password"
        label="Password"
        placeholder="Password"
        autofocus
        type="password" />
      <Input value={confirmation}
        onChange={setConfirmation}
        name="confirmation"
        type="password"
        label="Repeat password"
        placeholder="Repeat password" />
      <div className={`${styles.Bottom} ${styles.ResetPasswordBottom}`}>
        <div className={`${styles.FormBtn} ${styles.ResetPasswordBtn}`}><Button type="submit">Submit</Button></div>
      </div>
    </form>}
    {submitted &&
    <Link to="/authentication/login" className={`${styles.BottomLink} ${styles.ResetPasswordBottomLink}`}>Return to Log
      In</Link>}
  </div>

};

export default ResetPassword;