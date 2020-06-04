import React from "react";

//Styles
import styles from "./Main.module.scss";

type MainPropsTypes = {};

const Main = (props: MainPropsTypes) =>
  <section className={styles.Main}>
    <div className={styles.container}>
      <h1>Hello! This is a temp home page.</h1>
      You can go to <a href="/inner" style={{color: "blueviolet"}}>Private page</a> after login :)
    </div>
  </section>;

export default Main;