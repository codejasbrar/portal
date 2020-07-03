import React, {useEffect, useState} from "react";

//Styles
import styles from "./Navigation.module.scss";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {
  ordersApprovedState,
  ordersPendingState,
  testsApprovedState, testsIncompleteState, testsPendingState, userState
} from "../../selectors/selectors";


const Navigation = () => {
  const user = useSelector(userState);
  const ordersPending = useSelector(ordersPendingState);
  const ordersApproved = useSelector(ordersApprovedState);
  const testsPending = useSelector(testsPendingState);
  const testsApproved = useSelector(testsApprovedState);
  const testsIncomplete = useSelector(testsIncompleteState);
  const [counts, setCounts] = useState({
    op: ordersPending.length,
    oa: ordersApproved.length,
    tp: testsPending.length,
    ta: testsApproved.length,
    ti: testsIncomplete.length
  });

  useEffect(() => {
    setCounts({
      op: ordersPending.length,
      oa: ordersApproved.length,
      tp: testsPending.length,
      ta: testsApproved.length,
      ti: testsIncomplete.length
    });
  }, [ordersPending.length, ordersApproved.length, testsPending.length, testsApproved.length, testsIncomplete.length]);

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
      {!user.physician && <NavLink to={'/orders/test-incomplete'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Incomplete
        <span className={styles.navlinkNumber}>{counts.ti ? `(${counts.ti})` : ''}</span>
      </NavLink>}
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
