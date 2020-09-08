import React, {useEffect, useState} from "react";

//Styles
import styles from "./Autocomplete.module.scss";
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
  disabled?: boolean
};

const Autocomplete = (props: AutocompletePropsTypes) => {
  const [value, setValue] = useState('');
  const [opened, setOpened] = useState(false);

  const selectOption = (option: Option) => {
    setOpened(false);
    props.onSelect(option);
  };

  const onChange = (text: string) => {
    setOpened(true);
    setValue(text);
  };

  useEffect(() => {
    props.onChange(value);
  }, [value]);

  return <div className={`${styles.Autocomplete} ${props.classes ? props.classes.wrapper : ''}`}>
    <ClickOutside onClickOutside={() => setOpened(false)}>
      <>
        <Input className={props.classes ? props.classes.input : ''}
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