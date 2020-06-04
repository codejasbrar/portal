import React from "react";

//Styles
import styles from "../Authentication.module.scss";
import formStyles from "../../../components/LoginForm/LoginForm.module.scss";

import Input from "../../../components/Input/Input";
import {Link} from "react-router-dom";
import Button from "../../../components/Button/Button";

const ResetPassword = () => {
  return <div className={styles.FormWrapper}>
    <p className={styles.FormTitle}>Password recovery</p>
    <p className={styles.FormSubtitle}>Please enter your email</p>
    <form className={formStyles.Form}>
      <Input value={''} onChange={(text) => console.log(text)} name="email" label="Email" placeholder="Email" />
      <div className={formStyles.Bottom}>
        <Link to="/authentication/login" className={formStyles.BottomLink}>Back to login</Link>
        <div className={formStyles.FormBtn}><Button type="submit">Submit</Button></div>
      </div>
    </form>
  </div>;
};

export default ResetPassword;