import React from "react";

//Styles
import styles from "./Navigation.module.scss";

import {Link, NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {userState} from "../../selectors/selectors";
import CountersStore from "../../storage/CountersStore";
import {observer} from "mobx-react-lite";

type NavigationPropsTypes = {
  desktop?: boolean
};

const Navigation = observer((props: NavigationPropsTypes) => {
  const user = useSelector(userState);
  const {counters} = CountersStore;

  return <div className={`${styles.navigation} ${props.desktop ? '' : styles.mobileNavigation}`}>
    <h1 className={`${styles.heading30} ${styles.showTabletHorizontal}`}>Physician portal</h1>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Orders</h2>
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
      {!user.physician && <NavLink to={'/orders/tests-incomplete'} className={styles.navlink}
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
    {!user.physician && <div className={styles.navButtonBlock}>
      <Link className={styles.navButton} to='/labslip'>Create lab slip</Link>
    </div>}
  </div>
});

export default Navigation;
