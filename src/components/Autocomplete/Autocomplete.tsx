import React, {useEffect, useState} from "react";

//Styles
import styles from "./Autocomplete.module.scss";

import {ReactComponent as CloseIcon} from "../../icons/close.svg";
import Input from "../Input/Input";
import ClickOutside from "../ClickOutside/ClickOutside";

export type Option = {
  text: string,
  value: string
};

type AutocompletePropsTypes = {
  //value: string,
  onChange: (text: string) => void,
  onSelect: (option: Option) => void,
  name: string,
  label: string,
  options: Option[],
  placeholder?: string
  autofocus?: boolean,
  valid?: boolean,
  error?: boolean,
  classes?: {
    input?: string,
    wrapper?: string
  },
  disabled?: boolean,
};

const Autocomplete = (props: AutocompletePropsTypes) => {
  const [value, setValue] = useState('');
  const [selected, setSelected] = useState({} as Option);
  const [opened, setOpened] = useState(false);

  const selectOption = (option: Option) => {
    setOpened(false);
    setSelected(option);
    props.onSelect(option);
  };

  const onChange = (text: string) => {
    setOpened(true);
    setSelected({} as Option);
    setValue(text);
  };

  const clearValue = () => {
    setSelected({} as Option);
    setValue('');
  };

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return <div className={`${styles.Autocomplete} ${props.classes ? props.classes.wrapper : ''}`}>
    <ClickOutside onClickOutside={() => setOpened(false)}>
      <>
        <Input classes={{input: `${styles.AutocompleteInput} ${props.classes ? props.classes.input : ''}`}}
          value={value}
          onChange={onChange}
          label={props.label}
          name={props.name}
          placeholder={props.placeholder}
          onFocus={() => {
            setOpened(true)
          }}
          autoComplete='off'
        />
        {!!Object.keys(selected).length &&
        <button type='button' onClick={() => clearValue()} className={styles.AutocompleteClear}><CloseIcon /></button>}
        {!!props.options.length && opened && <div className={styles.AutocompleteDropdownWrapper}>
          <ul className={styles.AutocompleteDropdown}
            style={{height: props.options.length ? `${(props.options.length * 36) + 2}px` : 0}}>
            {props.options.map((option: Option, idx: number) => <li className={styles.AutocompleteDropdownItem}
              key={`${option.text}_${idx}`}
              onClick={() => selectOption(option)}>{option.text}</li>)}
          </ul>
        </div>}
      </>
    </ClickOutside>
  </div>
};

export default Autocomplete;