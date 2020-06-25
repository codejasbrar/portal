import React from "react";
import styles from "./SearchBarMobile.module.scss";
import {ReactComponent as SearchIcon} from "../../../icons/search.svg";

const SearchBarMobile = (props: any) =>
  <>
    <div className={styles.search}>
      <input className={styles.searchInput} type={'text'} onChange={props.onChange} placeholder="Search" />
      <span className={styles.searchIcon}><SearchIcon /></span>
    </div>
  </>

export default SearchBarMobile;