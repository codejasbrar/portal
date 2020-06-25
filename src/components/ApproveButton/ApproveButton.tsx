import React, {useEffect, useState} from "react";

//Styles
import styles from "./ApproveButton.module.scss";


import Button from "../Button/Button";
import Popup from "../Popup/Popup";
import {Order} from "../../interfaces/Order";

type ApproveButtonPropsTypes = {
  text: string,
  selected: Order[],
  mode: "order" | "result"
};

const ApproveButton = (props: ApproveButtonPropsTypes) => {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    console.log(props.selected);
  }, [props.selected]);

  const ItemsList = () => <div>
    <p>Are you sure you want to approve the following {props.mode}s?</p>
    <ul>
      {props.selected.map(item => <li key={item.id}>{props.mode} ID: {item.id}</li>)}
    </ul>
  </div>;

  const onApprove = () => {
    console.log(props.selected);
  };

  return <>
    <Button disabled={!props.selected.length} onClick={() => setShowPopup(true)}>{props.text}</Button>
    <Popup show={showPopup}>
      <div>
        <p>Submit for approval</p>
        {props.selected.length < 10 ? <ItemsList /> :
          <p>You have selected ({props.selected.length}) {props.mode === "result" ? 'test results' : 'orders'} for
            approval. Are you sure you want to approve?</p>}
        <div className={styles.btnBlock}>
          <Button secondary onClick={() => setShowPopup(false)}>Cancel</Button>
          <Button onClick={onApprove}>Approve</Button>
        </div>
      </div>
    </Popup>
  </>
};

export default ApproveButton;