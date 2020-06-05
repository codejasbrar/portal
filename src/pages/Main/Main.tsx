import React from "react";

//Styles
import styles from "./Main.module.scss";

type MainPropsTypes = {};

const Main = (props: MainPropsTypes) =>
  <section className={styles.Main}>
    <div className={styles.container}>
      <h1>Hello! This is a temp home page.</h1>
      You can go to <a href="/inner" style={{color: "blueviolet"}}>Private page</a> after login :)
      <h3>Now provides next routes:</h3>
      <ul className={styles.list}>
        <li className={styles.listItem}><a href="/authentication/verification">/authentication/verification</a></li>
        <li className={styles.listItem}>
          <a href="/authentication/reset-password?token=123">/authentication/reset-password</a>
          <p>*available with token (fake for now)</p>
        </li>
        <li className={styles.listItem}><a href="/authentication/recovery">/authentication/recovery</a></li>
      </ul>
    </div>
  </section>;

export default Main;