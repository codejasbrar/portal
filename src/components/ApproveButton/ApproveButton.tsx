import React, {useEffect, useState} from "react";

import Button from "../Button/Button";
import Popup from "../Popup/Popup";
import {Order} from "../../interfaces/Order";

//Styles
import styles from "./ApproveButton.module.scss";
import TestsStore from "../../stores/TestsStore";
import OrdersStore from "../../stores/OrdersStore";
import { useHistory } from "react-router-dom";

type ApproveButtonPropsTypes = {
  text: string,
  selected: Order[],
  onSaved: () => Promise<void>,
  onSelected?: (rows: []) => void,
  mode: "order" | "result",
  type?: "approved" | "pending"
  className?: string,
  mobile?: boolean
};

const ApproveButton = (props: ApproveButtonPropsTypes) => {
  const [showPopup, setShowPopup] = useState(false);
  const {saveResults} = TestsStore;
  const {saveOrders} = OrdersStore;
  const history = useHistory();
 
  const ItemsList = () => <div>
    <p className={styles.modalContentText}>
      Are you sure you want to {props.type && props.type === 'pending' ? 'set pending status' : 'approve'} the
      following {props.mode}s?
    </p>
    <ul className={styles.modalContentList}>
      {props.selected.map((item: any) => <li key={item.id}
        className={styles.modalContentItem}>{props.mode === 'result' ? 'Test result' : 'Order'} ID: <span>{item.id}</span>
      </li>)}
    </ul>
    {props.mode === 'result' && props.type !== 'pending' &&
    <p className={styles.modalContentText}>Results will be released to the customer as soon as they are approved.</p>}
  </div>;

  const onApprove = async () => {
    const hashes = props.selected.map((item: any) => item.hash);
    props.mode === 'order' ? await saveOrders(hashes) :
    props.type && props.type === 'pending' ? await saveResults(hashes, 'INCOMPLETE') : await saveResults(hashes, 'PENDING');
    await props.onSaved();
    if (props.onSelected) props.onSelected([]);
    if (props.mobile) {
      setShowPopup(false);
    }
    history.push("/orders/tests-incomplete");
  };

  useEffect(() => () => {
    setShowPopup(false);
  }, []);

  return <>
    <Button className={props.className ? props.className : ''}
      disabled={!props.selected || !props.selected.length}
      onClick={() => setShowPopup(true)}>{props.text}</Button>
    <Popup show={showPopup} classes={styles.modalApprove} onClose={() => setShowPopup(false)}>
      <div className={styles.modalContent}>
        <h2 className={styles.modalContentTitle}>Submit
          for {props.type && props.type === 'pending' ? 'set pending status' : 'approval'}</h2>
        {props.selected && props.selected.length < 10 ? <ItemsList /> :
          <p className={styles.modalContentText}>You have selected
            <span className={styles.modalContentBold}> ({props.selected && props.selected.length}) {props.mode === "result" ? 'test results' : 'orders'} </span>
            for {props.type && props.type === 'pending' ? 'set pending status' : 'approval'}. Are you sure you want
            to {props.type && props.type === 'pending' ? 'set pending status' : 'approve'}?</p>}
        <div className={`${styles.btnBlock} ${styles.btnBlockPopup}`}>
          <Button className={styles.btn} secondary onClick={() => setShowPopup(false)}>Cancel</Button>
          <Button className={styles.btn} onClick={onApprove}>Approve</Button>
        </div>
      </div>
    </Popup>
  </>
};

export default ApproveButton;
