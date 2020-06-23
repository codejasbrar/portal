import React from "react";

//Styles
import styles from "./Authentication.module.scss";

//Images
import bg1 from "../../images/login/bg1.jpg";
import bg2 from "../../images/login/bg2.jpg";
import bg3 from "../../images/login/bg3.jpg";
import bg4 from "../../images/login/bg4.jpg";
import bg5 from "../../images/login/bg5.jpg";
import bg6 from "../../images/login/bg6.jpg";
import bg7 from "../../images/login/bg7.jpg";

//Components
import {Route, Switch, Redirect} from "react-router-dom";
import Login from "./Steps/Login";
import Logout from "./Steps/Logout";
import PasswordRecovery from "./Steps/PasswordRecovery";
import SmsVerification from "./Steps/SmsVerification";
import ResetPassword from "./Steps/ResetPassword";
import Verification from "./Steps/Verification";

const bgArray = [bg1, bg2, bg3, bg4, bg5, bg6, bg7];

const Authentication = () => {

  return (
    <section className={styles.AuthBackground}
      style={{'backgroundImage': `url(${bgArray[Math.floor(Math.random() * 6)]})`}}>
      <div className={styles.container}>
        <div className={styles.Auth}>
          <Switch>
            <Route path="/authentication/" exact={true} render={() => <Redirect to="/authentication/login" />} />
            <Route path="/authentication/login" component={Login} />
            <Route path="/authentication/logout" component={Logout} />
            <Route path="/authentication/recovery" component={PasswordRecovery} />
            <Route path="/authentication/security-code" component={Verification} />
            <Route path="/authentication/verification" component={SmsVerification} />
            <Route path="/authentication/reset-password" component={ResetPassword} />
            <Route render={() => <Redirect to="/authentication/login" />} />
          </Switch>
        </div>
      </div>
    </section>
  );
};

export default Authentication;