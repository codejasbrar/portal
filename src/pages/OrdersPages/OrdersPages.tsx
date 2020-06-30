import styles from "./OrdersPages.module.scss";
import Navigation from "../../components/Navigation/Navigation";
import {Route, Redirect} from "react-router-dom";
import PendingOrdersPage from "./PendingOrdersPage/PendingOrdersPage";
import ApprovedOrdersPage from "./ApprovedOrdersPage/ApprovedOrdersPage";
import React, {useEffect, useState} from "react";
import TestPendingOrdersPage from "./TestPendingOrdersPage/TestPendingOrdersPage";
import TestApprovedPage from "./TestApprovedPage/TestApprovedPage";
import MobileNavigation from "../../components/Navigation/MobileNavigation";
import Spinner from "../../components/Spinner/Spinner";

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

const OrdersPage = () => {
  const [loading, setLoading] = useState(true);
  let [width, setWidth] = useState(getWidth());

  useEffect(() => {
    (async () => {
      setLoading(false);
    })();
    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  return <>
    {loading && <Spinner />}
    <section className={styles.wrapper}>
      <div className={styles.container}>
        <h1 className={`${styles.heading30} ${styles.hideTabletHorizontal}`}>Physician portal</h1>
        <div className={styles.containerFlex}>
          {width > 858 ? <Navigation /> : <Route path="/orders/navigation" component={MobileNavigation} />}
          <Route path="/orders" exact>
            <Redirect to="/orders/pending" />
          </Route>
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