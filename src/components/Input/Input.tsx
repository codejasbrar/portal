import React from "react";

//Styles
import styles from "./Input.module.scss";

type InputPropsTypes = {
  value?: string,
  onChange?: (text: string) => void,
  name: string,
  label: string,
  placeholder?: string
  type?: "text" | "password" | "date",
  autofocus?: boolean,
  valid?: boolean,
  error?: {
    valid: boolean,
    message: string
  }
  errorMessage?: string,
  classes?: {
    root?: string,
    input?: string
  },
  disabled?: boolean,
  onFocus?: () => void,
  autoComplete?: 'off' | 'on',
  required?: boolean,
  pattern?: string
};

const Input = (props: InputPropsTypes) => {

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(event.currentTarget.value)
  };

  return <div className={`${styles.InputWrapper} ${props.classes && props.classes.root ? props.classes.root : ''}`}>
    <label className={styles.InputLabel} htmlFor={props.name}>{props.label}</label>
    <input type={props.type || 'text'}
      className={`${styles.Input} ${props.error && !props.error?.valid ? styles.InputError : ''} ${props.valid ? styles.InputValid : ''} ${props.disabled ? styles.InputDisabled : ''} ${props.classes && props.classes.input ? props.classes.input : ''}`}
      value={props.value}
      autoFocus={props.autofocus}
      name={props.name}
      placeholder={props.placeholder || props.label}
      onChange={handleChange}
      tabIndex={1}
      onFocus={props.onFocus}
      autoComplete={props.autoComplete || 'on'}
      required={props.required}
      pattern={props.pattern}
    />
    {props.error && !props.error.valid && <span className={styles.InputErrorMessage}>{props.error?.message}</span>}
  </div>
}

export default Input;