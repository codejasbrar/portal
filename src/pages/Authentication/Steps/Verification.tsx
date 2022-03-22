import React, {useEffect, useState} from "react";

//Styles
import styles from "../../../components/LoginForm/LoginForm.module.scss";

import {useHistory} from "react-router-dom";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import ValidateFields from "../../../helpers/validateFields";
import Spinner from "../../../components/Spinner/Spinner";
import AuthStore from "../../../stores/AuthStore";
import {observer} from "mobx-react";

const Verification = observer(() => {
  const {tempData, loggedIn, isLoading, clearError, storeTempData, clearTempData, login, message, error} = AuthStore;
  const history = useHistory();
  const [localError, setLocalError] = useState('');
  const [code, setCode] = useState('');

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCode();
  };

  useEffect(() => {
    if (!tempData) {
      history.replace("/authentication")
    }
  }, [history, tempData]);

  useEffect(() => {
    if (loggedIn) {
      history.replace("/");
    }
  }, [loggedIn, history]);

  useEffect(() => {
    clearError();
  }, [clearError]);

  const submitCode = (): void => {
    const validation = ValidateFields([{name: 'Security code', type: "code", value: code}]);
    setLocalError(validation.message);
    if (!validation.valid) return;
    const userData = typeof tempData === 'string' ? JSON.parse(`${tempData}`) : tempData;
    if (tempData && !userData.password) {
      storeTempData({...userData, securityCode: code});
      history.push('/authentication/reset-password');
      return;
    }

    login({...userData, securityCode: code});
  };

  const backToLogin = () => {
    clearTempData();
    history.push('/authentication/login');
  };

  return (
    <>
      {isLoading && <Spinner />}
      <div className={`${styles.FormWrapper} ${styles.Verification}`}>
        <p className={styles.FormTitle}>Security Code Verification</p>
        <p className={`${styles.FormSubtitle} ${styles.VerificationSubtitle}`}>{message ? message : 'Enter the security code sent to your email or SMS'}</p>
        <span className={styles.FormText}>Your code is valid for 30 minutes. If you didn't receive the code or need a new one,
          <button className={styles.FormTextLink} onClick={backToLogin}>&nbsp;login again</button>.
        </span>
        <form className={styles.Form} onSubmit={onFormSubmit}>
          {!localError && error && <span className={styles.FormError}>{error.message}</span>}
          {localError && <span className={styles.FormError}>{localError}</span>}
          <Input value={code} onChange={setCode} name={"code"} label={"Security code"} placeholder={"Security code"} />
          <div className={`${styles.Bottom} ${styles.PasswordRecoveryBottom}`}>
            <button type="button" onClick={backToLogin} className={styles.BottomLink}>Back to Log In</button>
            <div className={`${styles.FormBtn} ${styles.PasswordRecoveryBtn}`}><Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </div>
    </>)
});

export default Verification;
