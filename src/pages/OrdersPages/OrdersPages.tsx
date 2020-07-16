import styles from "./OrdersPages.module.scss";
import Navigation from "../../components/Navigation/Navigation";
import {Route, Redirect} from "react-router-dom";
import PendingOrdersPage, {getWidth} from "./PendingOrdersPage/PendingOrdersPage";
import ApprovedOrdersPage from "./ApprovedOrdersPage/ApprovedOrdersPage";
import React, {useEffect, useState} from "react";
import TestPendingOrdersPage from "./TestPendingOrdersPage/TestPendingOrdersPage";
import TestApprovedPage from "./TestApprovedPage/TestApprovedPage";
import MobileNavigation from "../../components/Navigation/MobileNavigation";
import {useDispatch, useSelector} from "react-redux";
import TestDetailsPage from "./TestDetailsPage/TestDetailsPage";
import TestIncompletePage from "./TestIncompletePage/TestIncompletePage";
import {userState} from "../../selectors/selectors";

const OrdersPage = () => {
  const user = useSelector(userState);
  const [width, setWidth] = useState(getWidth());

  useEffect(() => {
    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);


  return <>
    <Route path={[
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
            {width > 858 ? <Navigation desktop /> : <Route path="/orders/navigation" component={MobileNavigation} />}

            <Route path="/orders" exact>
              <Redirect to="/orders/pending" />
            </Route>

            <Route path="/orders/pending" component={PendingOrdersPage} />
            <Route path="/orders/approved" component={ApprovedOrdersPage} />
            <Route path="/orders/tests" component={TestPendingOrdersPage} />
            <Route path="/orders/tests-approved" component={TestApprovedPage} />
            {user && !user.physician && <Route path="/orders/tests-incomplete" component={TestIncompletePage} />}
          </div>
        </div>
      </section>
    </Route>
    <Route path="/orders/test/:hash" component={TestDetailsPage} />
  </>
}

export default OrdersPage;
