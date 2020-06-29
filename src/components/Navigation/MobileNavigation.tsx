import React, {useEffect, useState} from "react";

//Styles
import styles from "./Navigation.module.scss";
import {NavLink} from "react-router-dom";
import LabSlipApiService from "../../services/LabSlipApiService";
//import {ordersState, testsState} from "../../selectors/selectors";

type NavigationPropsTypes = {};

const MobileNavigation = (props: NavigationPropsTypes) => {
  const [pendingOrdersCount, setPendingOrdersCount] = useState();
  const [approvedOrdersCount, setApprovedOrdersCount] = useState();
  const [pendingTestsCount, setPendingTestsCount] = useState();

  useEffect(() => {

    (async () => {
      const responseWithApproved = await LabSlipApiService.getOrdersByStatus('APPROVED');
      const responseWithPending = await LabSlipApiService.getOrdersByStatus('PENDING');

      setApprovedOrdersCount(responseWithApproved.data.length);
      setPendingOrdersCount(responseWithPending.data.length);
    })();
  }, []);

  // useEffect(() => {
  //   if (tests && tests.length) {
  //       setPendingTestsCount(orders.filter(tests => !tests.approved).length);
  //   }
  // }, [tests]);

  return <div className={styles.mobileNavigation}>
    <h1 className={styles.heading30}>Physician portal</h1>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Orders</h2>
    <nav className={styles.navList}>
      <NavLink to={'/orders/pending'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>{pendingOrdersCount ? `(${pendingOrdersCount})` : ''}</span>
      </NavLink>
      <NavLink to={'/orders/approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
        <span className={styles.navlinkNumber}>{approvedOrdersCount ? `(${approvedOrdersCount})` : ''}</span>
      </NavLink>
    </nav>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Test results</h2>
    <nav className={styles.navList}>
      <NavLink to={'/orders/test'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>{pendingTestsCount ? `(${pendingTestsCount})` : ''}</span>
      </NavLink>
      <NavLink to={'/orders/test-approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
      </NavLink>
    </nav>
  </div>
}

export default MobileNavigation;