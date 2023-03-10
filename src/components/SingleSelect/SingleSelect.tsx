import React, {useEffect, useState} from "react";

//Styles
import styles from "./SingleSelect.module.scss";


import ClickOutside from "../ClickOutside/ClickOutside";
import {ReactComponent as ArrowIcon} from "../../icons/arrow_down.svg";

export type SelectOption<T = string> = {
  name: string,
  value: T,
  disabled?: boolean
};

type SingleSelectPropsTypes<T = string> = {
  label: string,
  options: SelectOption<T>[],
  placeholder?: string,
  disabled?: boolean,
  className?: string
  onSelect?: (option: SelectOption<T>) => void,
  value?: T,
  error?: {
    valid: boolean,
    message: string
  }
};

const SingleSelect = <T extends unknown>(props: SingleSelectPropsTypes<T>) => {
  const [opened, setOpened] = useState(false);
  const [option, setOption] = useState({} as SelectOption<T>);

  const closeList = () => {
    setOpened(false);
  };

  const toggleList = () => {
    setOpened(!opened);
  };

  const selectOption = (option: SelectOption<T>) => {
    setOption(option);
    if (props.onSelect) props.onSelect(option);
    closeList();
  };

  useEffect(() => {
    if (props.value && props.options) {
      setOption(props.options.filter(option => option.value === props.value)[0]);
    } else {
      setOption({} as SelectOption<T>);
    }
  }, [props.value]);

  return <div className={`${styles.SelectWrapper} ${props.className ? props.className : ''}`}>
    <p className={styles.SelectLabel}>{props.label}</p>
    <ClickOutside className={styles.SelectArea} onClickOutside={closeList}>
      <div className={`${styles.Select} ${props.disabled ? styles.SelectDisabled : ''} ${props.error && !props.error.valid ? styles.SelectError : ''}`}
        tabIndex={1}
        onClick={toggleList}>
        <span className={styles.SelectValue}>{option.name || props.placeholder || 'Please select'}</span>
        <ArrowIcon className={`${styles.SelectValueIcon} ${opened ? styles.SelectValueIconOpened : ''}`} />
      </div>
      <div className={`${styles.SelectDropdownWrapper} ${opened ? styles.SelectDropdownOpened : ''}`}
        style={{height: opened ? `${((props.options.length * 36) + 2)}px` : 0}}>
        <ul className={styles.SelectDropdown} tabIndex={0}>
          {props.options.map((option: SelectOption<T>) => <li tabIndex={1}
            key={`${option.name}`}
            className={`${styles.SelectDropdownItem} ${option.disabled ? styles.SelectDropdownItemDisabled : ''}`}
            onClick={() => selectOption(option)}>{option.name}</li>)}
        </ul>
      </div>
    </ClickOutside>
    {props.error && !props.error.valid && <span className={styles.SelectErrorMessage}>{props.error?.message}</span>}
  </div>
};

export default SingleSelect;
