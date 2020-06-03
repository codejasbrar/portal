import React from "react";

//Styles
import styles from "./Checkbox.module.scss";

//Icons
import {ReactComponent as TickIcon} from "../../icons/tick.svg";

type CheckboxPropsTypes = {
  checked: boolean,
  onChange: (val: boolean) => void,
  name: string,
  label: string,
};

const Checkbox = (props: CheckboxPropsTypes) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.checked);
  };

  return <div>
    <span className={`${styles.CheckboxFake} ${props.checked ? styles.CheckboxFakeChecked : ''}`}>{props.checked &&
    <TickIcon />}</span>
    <label className={styles.CheckboxLabel}><input type="checkbox"
      className={styles.Checkbox}
      onChange={handleChange}
      checked={props.checked} /><span className={styles.CheckboxLabelName}>{props.label}</span></label>
  </div>

};

export default Checkbox;