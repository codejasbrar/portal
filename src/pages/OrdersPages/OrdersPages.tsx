import styles from "./OrdersPages.module.scss";
import Navigation from "../../components/Navigation/Navigation";
import {Route} from "react-router-dom";
import PendingOrdersPage from "./PendingOrdersPage/PendingOrdersPage";
import ApprovedOrdersPage from "./ApprovedOrdersPage/ApprovedOrdersPage";
import React, {useState} from "react";
import TestPendingOrdersPage from "./TestPendingOrdersPage/TestPendingOrdersPage";
import TestApprovedPage from "./TestApprovedPage/TestApprovedPage";

const OrdersPage = () => {
  const [show, setShow] = useState(false);

  const onClickShow = (e: any) => {
    setShow(true);
  }

  return <>
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={`${styles.heading30} ${styles.hideTabletHorizontal}`}>Physician portal</h1>
        <div className={styles.containerFlex}>
          <a onClick={onClickShow} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>Main menu</a>
          <div onClick={() => setShow(false)}>
            <Navigation show={show} />
          </div>
          <Route path="/orders/pending" component={PendingOrdersPage} />
          <Route path="/orders/approved" component={ApprovedOrdersPage} />
          <Route path="/orders/test" component={TestPendingOrdersPage} />
          <Route path="/orders/test-approved" component={TestApprovedPage} />
        </div>
      </div>
    </section>
  </>
}

export default OrdersPage;