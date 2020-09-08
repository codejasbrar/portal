import React, {useState} from "react";

//Styles
import styles from "./SingleSelect.module.scss";


import ClickOutside from "../ClickOutside/ClickOutside";
import {ReactComponent as ArrowIcon} from "../../icons/arrow_down.svg";

type Option = {
  name: string,
  value: string
};

type SingleSelectPropsTypes = {
  label: string,
  options: Option[],
  placeholder?: string,
  disabled?: boolean,
  className?: string
};

const SingleSelect = (props: SingleSelectPropsTypes) => {
  const [opened, setOpened] = useState(false);
  const [option, setOption] = useState({} as Option);

  const closeList = () => {
    setOpened(false);
  };

  const openList = () => {
    setOpened(true);
  };

  const toggleList = () => {
    setOpened(!opened);
  };

  const selectOption = (option: Option) => {
    setOption(option);
    closeList();
  };

  return <div className={`${styles.SelectWrapper} ${props.className ? props.className : ''}`}>
    <p className={styles.SelectLabel}>{props.label}</p>
    <ClickOutside className={styles.SelectArea} onClickOutside={closeList}>
      <div className={`${styles.Select} ${props.disabled ? styles.SelectDisabled : ''}`}
        tabIndex={1}
        onClick={toggleList}>
        <span className={styles.SelectValue}>{option.name || props.placeholder || 'Please select'}</span>
        <ArrowIcon className={`${styles.SelectValueIcon} ${opened ? styles.SelectValueIconOpened : ''}`} />
      </div>
      <div className={`${styles.SelectDropdownWrapper} ${opened ? styles.SelectDropdownOpened : ''}`}
        style={{height: opened ? `${((props.options.length * 36) + 2)}px` : 0}}>
        <ul className={styles.SelectDropdown} tabIndex={0}>
          {props.options.map((option: Option) => <li tabIndex={1}
            className={styles.SelectDropdownItem}
            onClick={() => selectOption(option)}>{option.name}</li>)}
        </ul>
      </div>
    </ClickOutside>
  </div>
};

export default SingleSelect;