import React, {useEffect} from "react";

import BodyScroll from "../../helpers/bodyScrollLock";

import styles from "./Spinner.module.scss";


const Spinner = () => {

  useEffect(() => {
    BodyScroll.disable();
    return () => {
      BodyScroll.enable();
    }
  }, []);
  return (<div className={`${styles.spinnerWrapper} ${styles.spinnerWrapperShow}`}>
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