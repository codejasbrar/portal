import React from "react";
import styles from "./SearchBarMobile.module.scss";
import {ReactComponent as SearchIcon} from "../../../icons/search.svg";

const SearchBarMobile = (props: any) =>
  <>
    <div className={styles.search}>
      <input value={props.value}
        autoComplete="off"
        className={styles.searchInput}
        type={'text'}
        onChange={(e) => props.onChange(e.target.value.replace(/\D/gi, ''))}
        placeholder="Order/Test ID or Customer ID" />
      <span className={styles.searchIcon}><SearchIcon /></span>
    </div>
  </>

export default SearchBarMobile;