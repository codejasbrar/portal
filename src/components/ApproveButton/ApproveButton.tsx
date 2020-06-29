import React, {useEffect, useState} from "react";

import Button from "../Button/Button";
import Popup from "../Popup/Popup";
import {Order} from "../../interfaces/Order";
import LabSlipApiService from "../../services/LabSlipApiService";

//Styles
import styles from "./ApproveButton.module.scss";

type ApproveButtonPropsTypes = {
  text: string,
  selected: Order[],
  onSaved: () => void,
  mode: "order" | "result",
  className?: string
};

const ApproveButton = (props: ApproveButtonPropsTypes) => {
  const [showPopup, setShowPopup] = useState(false);

  const ItemsList = () => <div>
    <p className={styles.modalContentText}>
      Are you sure you want to approve the following {props.mode}s?
    </p>
    <ul className={styles.modalContentList}>
      {props.selected.map(item => <li key={item.id} className={styles.modalContentItem}>{props.mode} ID: {item.id}</li>)}
    </ul>
  </div>;

  const onApprove = async () => {
    await LabSlipApiService.saveApprovedOrders(props.selected.map((item)=>item.hash));
    setShowPopup(false);
    props.onSaved();
  };

  return <>
    <Button className={props.className ? props.className : ''}
      disabled={!props.selected.length}
      onClick={() => setShowPopup(true)}>{props.text}</Button>
    <Popup show={showPopup} classes={styles.modalApprove}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalContentTitle}>Submit for approval</h2>
        {props.selected.length < 10 ? <ItemsList /> :
          <p className={styles.modalContentText}>You have selected
            <span className={styles.modalContentBold}> ({props.selected.length}) {props.mode === "result" ? 'test results' : 'orders'} </span>
            for approval. Are you sure you want to approve?</p>}
        <div className={styles.btnBlock}>
          <Button className={styles.btn} secondary onClick={() => setShowPopup(false)}>Cancel</Button>
          <Button className={styles.btn} onClick={onApprove}>Approve</Button>
        </div>
      </div>
    </Popup>
  </>
};

export default ApproveButton;