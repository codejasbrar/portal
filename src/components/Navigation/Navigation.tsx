import React, {useEffect, useState} from "react";

//Styles
import styles from "./Navigation.module.scss";
import {NavLink} from "react-router-dom";
import {useSelector} from "react-redux";
import {ordersState} from "../../selectors/selectors";

type NavigationPropsTypes = {};

const Navigation = (props: NavigationPropsTypes) => {
  const orders = useSelector(ordersState);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);

  useEffect(() => {
    if (orders && orders.length) {
      setPendingOrdersCount(orders.filter(order => !order.approved).length);
    }
  }, [orders]);

  return <div className={styles.navigation}>
    <h1 className={`${styles.heading30} ${styles.showTabletHorizontal}`}>Physician portal</h1>
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
  </div>
};

export default Navigation;