import React, {ReactElement, useEffect} from "react";

//Styles
import styles from "./Popup.module.scss";
import BodyScroll from "../../helpers/bodyScrollLock";

type PopupPropsTypes = {
  children: ReactElement,
  show: boolean,
  classes?: string,
  onClose: () => void
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
  return props.show ? <div className={styles.modalOverlay} onClick={() => props.onClose()}>
    <div className={`${styles.modal} ${props.classes ? props.classes : ''}`} onClick={(e) => e.stopPropagation()}>
      {props.children}
    </div>
  </div> : <></>;
}

export default Popup;