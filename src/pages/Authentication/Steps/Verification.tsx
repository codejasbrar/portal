import React, {useEffect, useState} from "react";

//Styles
import styles from "../../../components/LoginForm/LoginForm.module.scss";

import {useHistory} from "react-router-dom";
import Input from "../../../components/Input/Input";
import {Link} from "react-router-dom";
import Button from "../../../components/Button/Button";
import ValidateFields from "../../../helpers/validateFields";
import {useDispatch, useSelector} from "react-redux";
import {authState, loading} from "../../../selectors/selectors";
import {logIn} from "../../../actions/authActions";
import {AuthData} from "../../../services/AuthApiService";
import Spinner from "../../../components/Spinner/Spinner";

const Verification = () => {
  const dispatch = useDispatch();
  const auth = useSelector((store: Storage) => ({...authState(store)}));
  const isLoading = useSelector((store: Storage) => (loading(store)));
  const history = useHistory();
  const [error, setError] = useState('');
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
  }, []);

  useEffect(() => {
    if (auth.loggedIn) {
      history.replace("/inner");
    }
  }, [auth.loggedIn, history]);

  const submitCode = (): void => {
    const validation = ValidateFields([{name: 'Security code', type: "code", value: code}]);
    setLocalError(validation.message);
    if (!validation.valid) return;
    const userData = JSON.parse(`${auth.tempData}`);
    dispatch(logIn({...userData, securityCode: code}));
  };

  return (
    <>
      {isLoading && <Spinner />}
      <div className={`${styles.FormWrapper} ${styles.Verification}`}>
        <p className={styles.FormTitle}>Security Code Verification</p>
        <p className={`${styles.FormSubtitle} ${styles.VerificationSubtitle}`}>Enter the security code sent to your
          email.</p>
        <span className={styles.FormText}>Your code is valid for 30 minutes. If you didn't receive the code or need a new one,
          <Link className={styles.FormTextLink} to="/authentication/login"> login again</Link>.
        </span>
        <form className={styles.Form} onSubmit={onFormSubmit}>
          {!localError && auth.error && <span className={styles.FormError}>{auth.error.message}</span>}
          {localError && <span className={styles.FormError}>{localError}</span>}
          <Input value={code} onChange={setCode} name={"code"} label={"Security code"} placeholder={"Security code"} />
          <div className={`${styles.Bottom} ${styles.PasswordRecoveryBottom}`}>
            <Link to="/authentication/login" className={styles.BottomLink}>Back to Log In</Link>
            <div className={`${styles.FormBtn} ${styles.PasswordRecoveryBtn}`}><Button type="submit">Submit</Button>
            </div>
          </div>
        </form>
      </div>
    </>)
};

export default Verification;