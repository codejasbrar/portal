import React, {useState} from "react";

//Styles
import styles from "./Datepicker.module.scss";
import inputStyles from "../Input/Input.module.scss";

import {ReactComponent as CalendarIcon} from "../../icons/calendar.svg";

import DatePicker from "react-date-picker";

type DatepickerPropsTypes = {
  selected: string,
  onSelect: (date: string) => void,
  label: string,
  name: string,
  error?: {
    valid: boolean,
    message: string
  }
};

const Datepicker = (props: DatepickerPropsTypes) => {
  const {onSelect} = props;
  const [date, setDate] = useState();
  const dateFormat = 'MM/dd/yyyy';

  const onDateSelect = (date: Date | Date[]) => {
    if (date) {
      setDate(date);
      onSelect(formatDate(date as Date));
    }
  };

  const maxDate = new Date(new Date().setFullYear(new Date().getFullYear() - 18));

  const formatDate = (date: Date) => {
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    return `${date.getFullYear()}-${month}-${day}`;
  };

  return <div className={inputStyles.InputWrapper}>
    <label className={inputStyles.InputLabel} htmlFor={props.name}>{props.label}</label>
    <DatePicker
      clearIcon={null}
      calendarClassName={styles.DatepickerCalendar}
      className={`${styles.Datepicker} ${props.error && !props.error.valid ? styles.DatepickerError : ''}`}
      calendarIcon={<CalendarIcon />}
      dayPlaceholder={'DD'}
      monthPlaceholder={'MM'}
      yearPlaceholder={'YY'}
      maxDate={maxDate}
      format={dateFormat}
      value={date}
      onChange={onDateSelect}
      defaultActiveStartDate={maxDate}
    />
    {props.error && !props.error.valid && <span className={styles.DatepickerErrorMessage}>{props.error?.message}</span>}
  </div>
};

export default Datepicker;
