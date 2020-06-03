import React from "react";

import styles from "./Spinner.module.css";

type SpinnerPropsTypes = {
  show: boolean
};

const Spinner = (props: SpinnerPropsTypes) => {
  return (<div className={`${styles.spinnerWrapper} ${props.show ? styles.spinnerWrapperShow : ''}`}>
      <div className={styles.spinner}>
        <div className={styles.spinnerCircle}>
          <svg className={styles.circular} viewBox="25 25 50 50">
            <circle className={styles.path} cx="50" cy="50" r="20" fill="none" strokeWidth="2"
              strokeMiterlimit="10" />
          </svg>
        </div>
      </div>
    </div>
  )
};

export default Spinner;