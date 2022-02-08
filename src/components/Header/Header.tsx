import React from "react";
import {Link} from 'react-router-dom';

//Styles
import styles from "./Header.module.scss";

//Components
import Logo from "../Logo/Logo";
import AuthPanel from "../AuthPanel/AuthPanel";

//PropsTypes
type HeaderPropsTypes = {};

const Header = (props: HeaderPropsTypes) => {

  return <header className={styles.Header}>
    <div className={`${styles.container} ${styles.HeaderContainer}`}>
      <Logo />
      <Link to="/orders" className={`${styles.HeaderLink}`}>
        Orders
      </Link>
      <Link to="/users" className={`${styles.HeaderLink} ${styles.HeaderLinkLast}`}>
        User management
      </Link>
      <AuthPanel />
    </div>
  </header>;
};


export default Header;
