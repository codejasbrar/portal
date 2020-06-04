import React, {useEffect, useState} from "react";

//Styles
import styles from "./Login.module.scss";

//Images
import bg1 from "../../images/login/bg1.jpg";
import bg2 from "../../images/login/bg2.jpg";
import bg3 from "../../images/login/bg3.jpg";
import bg4 from "../../images/login/bg4.jpg";
import bg5 from "../../images/login/bg5.jpg";
import bg6 from "../../images/login/bg6.jpg";
import bg7 from "../../images/login/bg7.jpg";

//Components
import LoginForm from "../../components/LoginForm/LoginForm";
import {useHistory} from "react-router-dom";

type LoginPropsTypes = {
  mode?: "logout" | "remember"
};

const bgArray = [bg1, bg2, bg3, bg4, bg5, bg6, bg7];

const Login = (props: LoginPropsTypes) => {
  const history = useHistory();
  const [logout, setLogout] = useState(false);

  useEffect(() => {
    if (props.mode === 'logout' && history.action === 'REPLACE') {
      setLogout(true)
    } else {
      history.push('/login')
    }
  }, [history, props.mode]);

  return (
    <section className={styles.LoginBackground}
      style={{'backgroundImage': `url(${bgArray[Math.floor(Math.random() * 6)]})`}}>
      <div className={styles.container}>
        <div className={styles.Login}>
          <div className={styles.FormWrapper}>
            <p className={styles.FormTitle}>{logout ? 'Logout successful!' : 'InsideTracker'}</p>
            {!logout && <p className={styles.FormTitle}>Physician Portal</p>}
            <p className={styles.FormSubtitle}>{logout ? 'Enter your credentials to re-access your account.' : 'Exclusively for account administrators and physicians.'}</p>
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;