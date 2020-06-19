import React from "react";

//Styles
import styles from "./Navigation.module.scss";
import {NavLink} from "react-router-dom";

type NavigationPropsTypes = {
  show: boolean
};

const Navigation = (props: NavigationPropsTypes) =>

  <div className={`${styles.navigation} ${props.show ? styles.navigationShow : ''}`}>
    <h1 className={`${styles.heading30} ${styles.showTabletHorizontal}`}>Physician portal</h1>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Orders</h2>
    <nav className={styles.navList}>
      <NavLink to={'/orders/pending'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>(13)</span>
      </NavLink>
      <NavLink to={'/orders/approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
      </NavLink>
    </nav>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Test results</h2>
    <nav className={styles.navList}>
      <NavLink to={'/orders/test'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>(13)</span>
      </NavLink>
      <NavLink to={'/orders/test-approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
      </NavLink>
    </nav>
  </div>;

export default Navigation;