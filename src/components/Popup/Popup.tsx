import React, {ReactElement, useEffect} from "react";

//Styles
import styles from "./Popup.module.scss";
import BodyScroll from "../../helpers/bodyScrollLock";

type PopupPropsTypes = {
  children: ReactElement | ReactElement[],
  show: boolean,
  classes?: string,
  onClose: () => void,
  fullScreen?: boolean
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
  return <div className={`${styles.modalOverlay} ${props.show ? styles.modalOverlayShow : styles.modalOverlayHide} ${props.fullScreen ? styles.modalOverlayFullscreen : ''}`}
    onClick={() => props.onClose()}>
    <div className={`${styles.modal} ${props.classes ? props.classes : ''} ${props.fullScreen ? styles.modalFullscreen : ''}`}
      onClick={(e) => e.stopPropagation()}>
      {props.children}
    </div>
  </div>;
}

export default Popup;