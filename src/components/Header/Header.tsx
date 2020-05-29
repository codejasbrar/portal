import React from "react";

//Styles
import styles from "./Header.module.scss";

//Components
import Logo from "../Logo/Logo";
import AuthPanel from "../UserPanel/AuthPanel";

//PropsTypes
type HeaderPropsTypes = {};

const Header = (props: HeaderPropsTypes) => {

  return <header className={styles.Header}>
    <div className={`${styles.container} ${styles.HeaderContainer}`}>
      <Logo />
      <AuthPanel />
    </div>
  </header>;
};


export default Header;