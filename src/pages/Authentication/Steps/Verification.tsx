import React, {useEffect, useState} from "react";

//Styles
import styles from "../../../components/LoginForm/LoginForm.module.scss";

import {useHistory} from "react-router-dom";
import Input from "../../../components/Input/Input";
import Button from "../../../components/Button/Button";
import ValidateFields from "../../../helpers/validateFields";
import {useDispatch, useSelector} from "react-redux";
import {authState, loading} from "../../../selectors/selectors";
import {clearError, clearTempDataAction, fillAuthTempDataAction, logIn} from "../../../actions/authActions";
import Spinner from "../../../components/Spinner/Spinner";

const Verification = () => {
  const dispatch = useDispatch();
  const auth = useSelector(authState);
  const isLoading = useSelector(loading);
  const history = useHistory();
  const [localError, setLocalError] = useState('');
  const [code, setCode] = useState('');

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitCode();
  };

  useEffect(() => {
    if (!auth.tempData) {
      history.replace("/authentication")
    }
  }, [history, auth.tempData]);

  useEffect(() => {
    if (auth.loggedIn) {
      history.replace("/");
    }
  }, [auth.loggedIn, history]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const submitCode = (): void => {
    const validation = ValidateFields([{name: 'Security code', type: "code", value: code}]);
    setLocalError(validation.message);
    if (!validation.valid) return;
    const userData = typeof auth.tempData === 'string' ? JSON.parse(`${auth.tempData}`) : auth.tempData;
    if (auth.tempData && !userData.password) {
      dispatch(fillAuthTempDataAction({...userData, securityCode: code}))
      history.push('/authentication/reset-password');
      return;
    }
    dispatch(logIn({...userData, securityCode: code}));
    dispatch(clearTempDataAction());
  };

  const backToLogin = () => {
    dispatch(clearTempDataAction());
    history.push('/authentication/login');
  };

  return (
    <>
      {isLoading && <Spinner />}
      <div className={`${styles.FormWrapper} ${styles.Verification}`}>
        <p className={styles.FormTitle}>Security Code Verification</p>
        <p className={`${styles.FormSubtitle} ${styles.VerificationSubtitle}`}>{auth.message ? auth.message : 'Enter the security code sent to your email or SMS'}</p>
        <span className={styles.FormText}>Your code is valid for 30 minutes. If you didn't receive the code or need a new one,
          <button className={styles.FormTextLink} onClick={backToLogin}>&nbsp;login again</button>.
        </span>
        <form className={styles.Form} onSubmit={onFormSubmit}>
          {!localError && auth.error && <span className={styles.FormError}>{auth.error.message}</span>}
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
};

export default Verification;
