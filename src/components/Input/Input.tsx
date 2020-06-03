import React from "react";

//Styles
import styles from "./Input.module.scss";

type InputPropsTypes = {
  value: string,
  onChange: (text: string) => void,
  name: string,
  label: string,
  placeholder?: string
  type?: "text" | "password",
  autofocus?: boolean
};

const Input = (props: InputPropsTypes) => {

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    props.onChange(event.currentTarget.value)
  };

  return <div className={styles.InputWrapper}>
    <label className={styles.InputLabel} htmlFor={props.name}>{props.label}</label>
    <input type={props.type || 'text'}
      className={styles.Input}
      value={props.value}
      autoFocus={props.autofocus}
      name={props.name}
      placeholder={props.placeholder}
      onChange={handleChange} />
  </div>
}

export default Input;