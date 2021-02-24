import React, {ReactElement} from "react";

//Styles
import styles from "./Input.module.scss";
import {ReactComponent as CloseIcon} from "../../icons/close.svg";

type InputPropsTypes = {
  value?: string,
  onChange?: (text: string) => void,
  name: string,
  label?: string,
  placeholder?: string
  type?: "text" | "password" | "date" | "email",
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
  pattern?: string,
  clear?: boolean,
  icon?: ReactElement
};

const Input = (props: InputPropsTypes) => {

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    if (props.onChange) props.onChange(event.currentTarget.value)
  };

  const clearValue = () => {
    if (props.onChange) props.onChange('')
  };

  const renderIcon = (icon: ReactElement) => {
    return React.cloneElement(icon, {className: styles.InputIconedIcon})
  };

  return <div className={`${styles.InputWrapper} ${props.classes && props.classes.root ? props.classes.root : ''}`}>
    <label className={styles.InputLabel} htmlFor={props.name}>{props.label}</label>
    <input type={props.type || 'text'}
      className={`${styles.Input} ${props.error && !props.error?.valid ? styles.InputError : ''} ${props.valid ? styles.InputValid : ''} ${props.disabled ? styles.InputDisabled : ''} ${props.classes && props.classes.input ? props.classes.input : ''} ${props.icon ? styles.InputIconed : ''} ${props.icon ? styles.InputClear : ''}`}
      value={props.value}
      autoFocus={props.autofocus}
      name={props.name}
      id={props.name}
      placeholder={props.placeholder || props.label}
      onChange={handleChange}
      tabIndex={0}
      onFocus={props.onFocus}
      autoComplete={props.autoComplete || 'on'}
      required={props.required}
      pattern={props.pattern}
    />
    {props.icon && renderIcon(props.icon)}
    {props.clear && !!props.value &&
    <button type='button' onClick={() => clearValue()} className={styles.InputClearBtn}><CloseIcon /></button>}
    {props.error && !props.error.valid && <span className={styles.InputErrorMessage}>{props.error?.message}</span>}
  </div>
}

export default Input;
