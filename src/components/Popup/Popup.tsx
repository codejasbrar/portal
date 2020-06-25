import React, {ReactElement, useEffect} from "react";

//Styles
import styles from "./Popup.module.scss";
import BodyScroll from "../../helpers/bodyScrollLock";

type PopupPropsTypes = {
  children: ReactElement,
  show: boolean,
  classes?: string
};

const Popup = (props: PopupPropsTypes) => {
  useEffect(() => {
    if (props.show) {
      BodyScroll.disable();
    } else {
      BodyScroll.enable();
    }
    return () => {
      BodyScroll.enable();
    }
  }, [props.show]);
  return props.show ? <div className={styles.modalOverlay}>
    <div className={`${styles.modal} ${props.classes ? props.classes : ''}`}>
      {props.children}
    </div>
  </div> : <></>;
}

export default Popup;