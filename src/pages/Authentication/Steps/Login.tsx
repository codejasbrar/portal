import React from "react";

import LoginForm from "../../../components/LoginForm/LoginForm";

//Styles
import styles from "../../../components/LoginForm/LoginForm.module.scss";

const Login = () => {
  return <div className={styles.FormWrapper}>
    <p className={styles.FormTitle}>InsideTracker</p>
    <p className={styles.FormTitle}>Physician Portal</p>
    <p className={styles.FormSubtitle}>Exclusively for account administrators and physicians.</p>
    <LoginForm />
  </div>;
};

export default Login;