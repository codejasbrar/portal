import styles from "./OrdersPages.module.scss";
import Navigation from "../../components/Navigation/Navigation";
import {Route, Redirect} from "react-router-dom";
import PendingOrdersPage from "./PendingOrdersPage/PendingOrdersPage";
import ApprovedOrdersPage from "./ApprovedOrdersPage/ApprovedOrdersPage";
import React, {useEffect} from "react";
import TestPendingOrdersPage from "./TestPendingOrdersPage/TestPendingOrdersPage";
import TestApprovedPage from "./TestApprovedPage/TestApprovedPage";
import {useDispatch, useSelector} from "react-redux";
import TestDetailsPage from "./TestDetailsPage/TestDetailsPage";
import TestIncompletePage from "./TestIncompletePage/TestIncompletePage";
import {isAdmin} from "../../selectors/selectors";
import {loadCounters} from "../../actions/countersActions";
import useResizeListener from "../../hooks/useResizeListener";

const OrdersPage = () => {
  const admin = useSelector(isAdmin);
  const width = useResizeListener();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      await dispatch(loadCounters());
    })();
  }, [dispatch]);

  return <>
    <Route exact path={[
      "/orders",
      "/orders/navigation",
      "/orders/pending",
      "/orders/approved",
      "/orders/tests",
      "/orders/tests-approved",
      "/orders/tests-incomplete"
    ]}>
      <section className={styles.wrapper}>
        <div className={styles.container}>
          <h1 className={`${styles.heading30} ${styles.hideTabletHorizontal}`}>Physician portal</h1>
          <div className={styles.containerFlex}>
            {width > 858 ? <Navigation desktop /> : <Route path="/orders/navigation" component={Navigation} />}
            {width > 858 && <Route path="/orders/navigation" exact>
              <Redirect to="/orders/pending" />
            </Route>}
            <Route path="/orders" exact>
              <Redirect to="/orders/pending" />
            </Route>
            <Route path="/orders/pending" component={PendingOrdersPage} />
            <Route path="/orders/approved" component={ApprovedOrdersPage} />
            <Route path="/orders/tests" component={TestPendingOrdersPage} />
            <Route path="/orders/tests-approved" component={TestApprovedPage} />
            {admin ? <Route path="/orders/tests-incomplete" component={TestIncompletePage} /> : <Route path="/orders/tests-incomplete">
              <Redirect to="/orders/pending" />
            </Route>}
          </div>
        </div>
      </section>
    </Route>
    <Route path="/orders/test/:hash" component={TestDetailsPage} />
  </>
};

export default OrdersPage;
