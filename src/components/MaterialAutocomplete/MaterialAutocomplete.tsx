import styles from './MaterialAutocomplete.module.scss'
import React from "react";
import {AutocompleteProps} from "@material-ui/lab";
import Autocomplete from "@material-ui/lab/Autocomplete";

type Props<T, Multiple extends boolean | undefined = undefined, DisableClearable extends boolean | undefined = undefined, FreeSolo extends boolean | undefined = undefined> =
  {
    name?: string,
    label?: string,
    error?: string
  }
  & AutocompleteProps<T, Multiple, DisableClearable, FreeSolo>

const MaterialAutocomplete = <T, Multiple extends boolean | undefined = undefined, DisableClearable extends boolean | undefined = undefined, FreeSolo extends boolean | undefined = undefined>({
  name,
  label,
  error,
  ...restProps
}: Props<T, Multiple, DisableClearable, FreeSolo>) =>
  <div className={`${styles.AutocompleteWrapper}`}>
    <label
      className={styles.AutocompleteLabel}
      htmlFor={name}>
      {label}
    </label>
    <Autocomplete
      size="small"
      className={styles.Field}
      classes={{
        inputRoot: styles.inputRoot
      }}
      {...restProps}
    />
    {error &&
    <span className={styles.AutocompleteErrorMessage}>
      {error}
    </span>}
  </div>

export default MaterialAutocomplete;
