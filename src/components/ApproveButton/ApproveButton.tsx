import React, {useEffect, useState} from "react";

import Button from "../Button/Button";
import Popup from "../Popup/Popup";
import {Order} from "../../interfaces/Order";
import LabSlipApiService from "../../services/LabSlipApiService";

//Styles
import styles from "./ApproveButton.module.scss";
import Spinner from "../Spinner/Spinner";
import {saveApprovedResults, savePendingResults} from "../../actions/testsActions";
import {saveOrders} from "../../actions/ordersActions";
import {useDispatch} from "react-redux";

type ApproveButtonPropsTypes = {
  text: string,
  selected: Order[],
  onSaved: () => Promise<any>,
  mode: "order" | "result",
  type?: "approved" | "pending"
  className?: string
};

const ApproveButton = (props: ApproveButtonPropsTypes) => {
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

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
    setLoading(true);
    const hashes = props.selected.map((item: any) => item.hash);
    props.mode === 'order' ? await dispatch(saveOrders(hashes)) :
      props.type && props.type === 'pending' ? await dispatch(savePendingResults(hashes)) : await dispatch(saveApprovedResults(hashes));
    await props.onSaved();
    setLoading(false);
    setShowPopup(false);
  };

  return <>
    <Button className={props.className ? props.className : ''}
      disabled={!props.selected || !props.selected.length}
      onClick={() => setShowPopup(true)}>{props.text}</Button>
    {loading && <Spinner />}
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
