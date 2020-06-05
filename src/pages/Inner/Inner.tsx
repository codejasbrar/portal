import React from "react";

//Styles
import styles from "./Inner.module.scss";

type InnerPropsTypes = {};

const Inner = (props: InnerPropsTypes) => <section className={styles.Inner}>
  <div className={styles.container}>
    <h1>Now you are on temporary private page</h1>
  </div>
</section>;
;

export default Inner;