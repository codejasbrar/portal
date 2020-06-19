import React from 'react';
import styles from "../OrdersPages.module.scss";

const PendingOrdersPage = () =>
  <section className={styles.orders}>
    <h2 className={styles.heading20}>Orders pending approval</h2>
    <div className={styles.table}/>
  </section>

export default PendingOrdersPage;
