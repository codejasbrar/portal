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
import {useDispatch, useSelector} from "react-redux";
import TestDetailsPage from "./TestDetailsPage/TestDetailsPage";
import {loadAdminData, loadAllData} from "../../actions/ordersActions";
import TestIncompletePage from "./TestIncompletePage/TestIncompletePage";
import {loadingDataState, ordersState, testsState, userState} from "../../selectors/selectors";
import {log} from "util";

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

const OrdersPage = () => {
  const user = useSelector(userState);
  const [width, setWidth] = useState(getWidth());
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (user && Object.keys(user).length) {
        user.physician ? await dispatch(loadAllData()) : await dispatch(loadAdminData());
        setLoading(false);
      }
    })();
  }, [user]);


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
    {loading && <Spinner />}
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
            {width > 858 ? <Navigation /> : <Route path="/orders/navigation" component={MobileNavigation} />}

            <Route path="/orders" exact>
              <Redirect to="/orders/pending" />
            </Route>

            <Route path="/orders/pending" component={PendingOrdersPage} />
            <Route path="/orders/approved" component={ApprovedOrdersPage} />
            <Route path="/orders/tests" component={TestPendingOrdersPage} />
            <Route path="/orders/tests-approved" component={TestApprovedPage} />
            <Route path="/orders/tests-incomplete" component={TestIncompletePage} />
          </div>
        </div>
      </section>
    </Route>
    <Route path="/orders/test/:hash" component={TestDetailsPage} />
  </>
}

export default OrdersPage;
