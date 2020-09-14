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
    <Button onClick={() => onDiscard()} className={styles.SubmitPanelBtn} secondary>Discard lab slip</Button>
    <Button className={styles.SubmitPanelBtn} onClick={() => onSubmit()} disabled={disabledSubmit}>Create lab slip</Button>
  </div>
};

export default SubmitPanel;