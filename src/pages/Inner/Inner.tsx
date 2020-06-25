import React, {useEffect, useState} from "react";

//Styles
import styles from "./Inner.module.scss";
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../../components/Spinner/Spinner";
import {loadOrdersByStatus} from "../../actions/ordersActions";
import {ordersState} from "../../selectors/selectors";

type InnerPropsTypes = {};

const Inner = (props: InnerPropsTypes) => {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const orders = useSelector(ordersState);

    console.log(orders);

    useEffect(() => {
      (async () => {
        await dispatch(loadOrdersByStatus('PENDING'));
        setLoading(false);
      })();
    }, []);

    return <>
      {loading && <Spinner />}
      <section className={styles.Inner}>
        <div className={styles.container}>
          <h1>Now you are on temporary private page</h1>
        </div>
      </section>
    </>
  }
;

export default Inner;