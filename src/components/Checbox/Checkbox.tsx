import React, {useRef, useState} from "react";

//Styles
import styles from "./Checkbox.module.scss";

//Icons
import {ReactComponent as TickIcon} from "../../icons/tick.svg";

type CheckboxPropsTypes = {
  checked: boolean,
  onChange: (val: boolean) => void,
  name: string,
  label: string,
  classes?: {
    label?: string
  }
};

const Checkbox = (props: CheckboxPropsTypes) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef() as React.MutableRefObject<HTMLInputElement>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(e.target.checked);
  };

  const handlePress = (e: React.KeyboardEvent<HTMLSpanElement>) => {
    if (focused && e.key === 'Enter') {
      props.onChange(!props.checked);
    }
  };

  return <div className={styles.CheckboxWrapper}>
    <span
      tabIndex={0}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      onKeyPress={handlePress}
      className={`${styles.CheckboxFake}${props.checked ? ` ${styles.CheckboxFakeChecked}` : ''}`}
    >
      {props.checked && <TickIcon />}
    </span>
    <label className={styles.CheckboxLabel}>
      <input type="checkbox"
        className={styles.Checkbox}
        onChange={handleChange}
        checked={props.checked}
        ref={inputRef}
      />
      <span className={`${styles.CheckboxLabelName} ${props.classes && props.classes.label ? props.classes.label : ''}`}>
        {props.label}
      </span>
    </label>
  </div>

};

export default Checkbox;
