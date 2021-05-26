import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

//Styles
import styles from "../../../components/LoginForm/LoginForm.module.scss";

//Components
import ValidateFields from "../../../helpers/validateFields";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import AuthApiService from "../../../services/AuthApiService";
import AuthStore from "../../../stores/AuthStore";
import {observer} from "mobx-react";

const ResetPassword = observer(() => {
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [localError, setLocalError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const {tempData, clearError, clearTempData} = AuthStore;

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
    if (!tempData) return;
    AuthApiService.resetPassword({
      username: tempData?.username,
      securityCode: tempData.securityCode,
      "password": password
    }).then(response => {
      setSubmitted(true);
      clearTempData();
    }).catch(error => {
      setLocalError(error.response.data.message);
    })
  };

  useEffect(() => {
    clearError();
  }, [clearError]);

  return <div className={`${styles.FormWrapper} ${styles.ResetPassword}`}>
    <p className={styles.FormTitle}>{submitted ? 'Your password was updated!' : 'Reset your password'}</p>
    <p className={`${styles.FormSubtitle} ${styles.ResetPasswordSubtitle}`}>{submitted ? 'You can now log in to your account with your new password.' : 'Must be a minimum of 8 characters, and must contain at least one number.'}</p>
    {!submitted && <form className={`${styles.Form} ${styles.ResetPasswordForm}`} onSubmit={onFormSubmit}>
      {/*{!localError && error && <span className={styles.FormError}>{error.message}</span>}*/}
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
});

export default ResetPassword;
