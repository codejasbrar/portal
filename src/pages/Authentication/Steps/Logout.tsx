import React from "react";

import LoginForm from "../../../components/LoginForm/LoginForm";

//Styles
import styles from "../../../components/LoginForm/LoginForm.module.scss";

const Logout = () =>
  <div className={styles.FormWrapper}>
    <p className={styles.FormTitle}>Logout successful!</p>
    <p className={styles.FormSubtitle}>Enter your credentials to re-access your account.</p>
    <LoginForm logout />
  </div>;

export default Logout;
