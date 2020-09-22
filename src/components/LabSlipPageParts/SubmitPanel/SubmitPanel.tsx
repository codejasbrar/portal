import React from "react";

//Styles
import styles from "../../../pages/Labslip/LabSlipPage.module.scss";
import Button from "../../Button/Button";

type SubmitPanelPropsTypes = {
  onDiscard: () => void,
  onSubmit: () => void
  disabledSubmit: boolean
};

const SubmitPanel = (props: SubmitPanelPropsTypes) => {
  const {onDiscard, onSubmit, disabledSubmit} = props;

  return <div className={styles.SubmitPanel}>
    <Button onClick={() => onDiscard()}
      className={styles.SubmitPanelBtn}
      secondary><>Discard <span className={styles.hideMobile}>lab slip</span></>
    </Button>
    <Button className={styles.SubmitPanelBtn} onClick={() => onSubmit()} disabled={disabledSubmit}><>Create <span
      className={styles.hideMobile}>lab slip</span></>
    </Button>
  </div>
};

export default SubmitPanel;