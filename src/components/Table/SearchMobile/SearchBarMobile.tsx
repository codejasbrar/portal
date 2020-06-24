import React from "react";
import styles from "./SearchBarMobile.module.scss";
import {ReactComponent as SearchIcon} from "../../../icons/search.svg";

export default () => <>
  <div className={styles.search}>
    <input className={styles.searchInput} type={'text'} placeholder="Search" />
    <span className={styles.searchIcon}><SearchIcon /></span>
  </div>
</>