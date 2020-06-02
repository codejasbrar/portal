import React from "react";

//Styles
import styles from "./Overlay.module.scss";

type OverlayPropsTypes = {
  show: boolean
}

const Overlay = (props: OverlayPropsTypes) => props.show ? <div className={styles.Overlay} /> : null;

export default Overlay;