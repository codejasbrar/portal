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
  autofocus?: boolean,
  valid?: boolean,
  error?: boolean,
  className?: string
};

const Input = (props: InputPropsTypes) => {

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    props.onChange(event.currentTarget.value)
  };

  return <div className={`${styles.InputWrapper} ${props.className ? props.className : ''}`}>
    <label className={styles.InputLabel} htmlFor={props.name}>{props.label}</label>
    <input type={props.type || 'text'}
      className={`${styles.Input} ${props.error ? styles.InputError : ''} ${props.valid ? styles.InputValid : ''}`}
      value={props.value}
      autoFocus={props.autofocus}
      name={props.name}
      placeholder={props.placeholder}
      onChange={handleChange}
      tabIndex={1}
    />
  </div>
}

export default Input;