import React, {useEffect, useState} from "react";

//Styles
import styles from "./Navigation.module.scss";
import {NavLink} from "react-router-dom";
import {observer} from "mobx-react";
import CountersStore from "../../stores/CountersStore";
import UserStore from "../../stores/UserStore";

const MobileNavigation = observer(() => {
  const {physician} = UserStore;
  const {counters, getCounters, loaded} = CountersStore;

  useEffect(() => {
    if (!loaded) getCounters();
  }, []);

  return <div className={styles.mobileNavigation}>
    <h1 className={styles.heading30}>Physician portal</h1>
    <nav className={styles.navList}>
      <NavLink to={'/orders/pending'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>{counters.pendingOrders ? `(${counters.pendingOrders})` : ''}</span>
      </NavLink>
      <NavLink to={'/orders/approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
        <span className={styles.navlinkNumber}>{counters.approvedOrders ? `(${counters.approvedOrders})` : ''}</span>
      </NavLink>
    </nav>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Test results</h2>
    <nav className={styles.navList}>
      {!physician && <NavLink to={'/orders/tests-incomplete'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Incomplete
        <span className={styles.navlinkNumber}>{counters.incompleteResults ? `(${counters.incompleteResults})` : ''}</span>
      </NavLink>}
      <NavLink to={'/orders/tests'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>{counters.pendingResults ? `(${counters.pendingResults})` : ''}</span>
      </NavLink>
      <NavLink to={'/orders/tests-approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
        <span className={styles.navlinkNumber}>{counters.approvedResults ? `(${counters.approvedResults})` : ''}</span>
      </NavLink>
    </nav>
  </div>
});

export default MobileNavigation;
