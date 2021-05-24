import React, {useEffect, useState} from "react";
import {useHistory} from 'react-router-dom';

//Styles
import styles from "../../../components/LoginForm/LoginForm.module.scss";

import Input from "../../../components/Input/Input";
import {Link} from "react-router-dom";
import Button from "../../../components/Button/Button";
import ValidateFields from "../../../helpers/validateFields";
import AuthApiService from "../../../services/AuthApiService";
import {useDispatch} from "react-redux";
import {clearError, fillAuthTempDataAction} from "../../../actions/authActions";

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = ValidateFields([{name: "Email", type: "email", value: email}]);
    setError(validation.message);
    if (!validation.valid) return;
    AuthApiService.requestPasswordReset(email)
      .then(response => {
        dispatch(fillAuthTempDataAction({username: email}, response.data.status as string))
        history.push('/authentication/security-code')
      }).catch(error => {
      setError(error.response.data.message);
    })
    setSubmitted(true);
  };

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return <div className={`${styles.FormWrapper} ${styles.PasswordRecovery}`}>
    <p className={styles.FormTitle}>
      {
        submitted ?
          'Check your email' :
          'Password recovery'
      }
    </p>
    <p className={styles.FormSubtitle}>
      {
        submitted ?
          "You've successfully answered your account security question and we've send you an email with further instructions." :
          'Please enter your email'
      }
    </p>
    {
      !submitted &&
      <form
        className={styles.Form}
        onSubmit={onFormSubmit}
      >
        {
          error &&
          <span className={styles.FormError}>
            {error}
          </span>
        }
        <Input
          value={email}
          onChange={setEmail}
          name="email"
          label="Email"
          placeholder="Email"
          type="email"
        />
        <div className={`${styles.Bottom} ${styles.PasswordRecoveryBottom}`}>
          <Link
            to="/authentication/login"
            className={styles.BottomLink}
          >
            Back to Log In
          </Link>
          <div className={`${styles.FormBtn} ${styles.PasswordRecoveryBtn}`}>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </div>
      </form>}
    {submitted &&
    <Link
      to="/authentication/login"
      className={styles.BottomLink}
    >
      Return to Log In
    </Link>}
  </div>;
};

export default PasswordRecovery;
