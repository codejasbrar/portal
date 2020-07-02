import React, {useEffect, useState} from "react";

//Styles
import styles from "./Navigation.module.scss";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {
  ordersApprovedState,
  ordersPendingState, ordersState,
  testsApprovedState,
  testsPendingState, testsState
} from "../../selectors/selectors";

type NavigationPropsTypes = {};

const Navigation = (props: NavigationPropsTypes) => {
  const orders = useSelector(ordersState);
  const tests = useSelector(testsState);
  const ordersPending = useSelector(ordersPendingState);
  const ordersApproved = useSelector(ordersApprovedState);
  const testsPending = useSelector(testsPendingState);
  const testsApproved = useSelector(testsApprovedState);
  const [counts, setCounts] = useState({
    op: ordersPending.length,
    oa: ordersApproved.length,
    tp: testsPending.length,
    ta: testsApproved.length
  });

  useEffect(() => {
    setCounts({
      op: ordersPending.length,
      oa: ordersApproved.length,
      tp: testsPending.length,
      ta: testsApproved.length
    });
  }, [orders, tests]);

  return <div className={styles.navigation}>
    <h1 className={`${styles.heading30} ${styles.showTabletHorizontal}`}>Physician portal</h1>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Orders</h2>
    <nav className={styles.navList}>
      <NavLink to={'/orders/pending'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>{counts.op ? `(${counts.op})` : ''}</span>
      </NavLink>
      <NavLink to={'/orders/approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
        <span className={styles.navlinkNumber}>{counts.oa ? `(${counts.oa})` : ''}</span>
      </NavLink>
    </nav>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Test results</h2>
    <nav className={styles.navList}>
      <NavLink to={'/orders/test'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>{counts.tp ? `(${counts.tp})` : ''}</span>
      </NavLink>
      <NavLink to={'/orders/test-approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
        <span className={styles.navlinkNumber}>{counts.ta ? `(${counts.ta})` : ''}</span>
      </NavLink>
    </nav>
  </div>
};

export default Navigation;
