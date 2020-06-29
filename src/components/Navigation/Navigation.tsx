import React, {useEffect, useState} from "react";

//Styles
import styles from "./Navigation.module.scss";
import {NavLink} from "react-router-dom";
import LabSlipApiService from "../../services/LabSlipApiService";
import {useSelector} from "react-redux";
import {
  ordersApprovedState,
  ordersPendingState,
  testsApprovedState,
  testsPendingState
} from "../../selectors/selectors";

type NavigationPropsTypes = {};

const Navigation = (props: NavigationPropsTypes) => {
  const ordersPending = useSelector(ordersPendingState);
  const ordersApproved = useSelector(ordersApprovedState);
  const testsPending = useSelector(testsPendingState);
  const testsApproved = useSelector(testsApprovedState);
  // const [pendingOrdersCount, setPendingOrdersCount] = useState();
  // const [approvedOrdersCount, setApprovedOrdersCount] = useState();
  // const [pendingTestsCount, setPendingTestsCount] = useState();

  // useEffect(() => {
  //
  //   (async () => {
  //     const responseWithApproved = await LabSlipApiService.getOrdersByStatus('APPROVED');
  //     const responseWithPending = await LabSlipApiService.getOrdersByStatus('PENDING');
  //     const responseTestsWithPending = await LabSlipApiService.getTestsByStatus('PENDING');
  //
  //     setApprovedOrdersCount(responseWithApproved.data.length);
  //     setPendingOrdersCount(responseWithPending.data.length);
  //     setPendingTestsCount(responseTestsWithPending.data.length)
  //   })();
  // }, []);

  return <div className={styles.navigation}>
    <h1 className={`${styles.heading30} ${styles.showTabletHorizontal}`}>Physician portal</h1>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Orders</h2>
    <nav className={styles.navList}>
      <NavLink to={'/orders/pending'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>{ordersPending.length ? `(${ordersPending.length})` : ''}</span>
      </NavLink>
      <NavLink to={'/orders/approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
        <span className={styles.navlinkNumber}>{ordersApproved.length ? `(${ordersApproved.length})` : ''}</span>
      </NavLink>
    </nav>
    <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Test results</h2>
    <nav className={styles.navList}>
      <NavLink to={'/orders/test'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Pending approval
        <span className={styles.navlinkNumber}>{testsPending.length ? `(${testsPending.length})` : ''}</span>
      </NavLink>
      <NavLink to={'/orders/test-approved'} className={styles.navlink}
        exact={true}
        activeClassName={styles.active}>
        Approved
      </NavLink>
    </nav>
  </div>
};

export default Navigation;
