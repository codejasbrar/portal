import React from "react";
import {Link} from 'react-router-dom';

//Styles
import styles from "./Header.module.scss";

//Components
import Logo from "../Logo/Logo";
import AuthPanel from "../AuthPanel/AuthPanel";
import AuthStore from "../../stores/AuthStore";

//PropsTypes
type HeaderPropsTypes = {};

export const Menu = () => {
  const {loggedIn} = AuthStore;
  return loggedIn ? <>
    <Link to="/orders" className={`${styles.HeaderLink}`}>
      Orders
    </Link>
    <Link to="/users" className={`${styles.HeaderLink} ${styles.HeaderLinkLast}`}>
      User management
    </Link>
  </> : null
}

const Header = (props: HeaderPropsTypes) => {
  return <header className={styles.Header}>
    <div className={`${styles.container} ${styles.HeaderContainer}`}>
      <Logo />
      {window.innerWidth > 798 && <Menu />}
      <AuthPanel />
    </div>
  </header>;
};


export default Header;
