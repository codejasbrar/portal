import React from "react";
import styles from "./SearchBar.module.scss";
import {ReactComponent as SearchIcon} from "../../../icons/search.svg";

export default (
  searchText: string,
  handleSearch: any,
  hideSearch: any,
  options: any
) => <>
  <div className={styles.search}>
    <input className={styles.searchInput} type={'text'} value={searchText} placeholder="Search" onChange={(e: any)=> handleSearch(e.target.value)} />
    <span className={styles.searchIcon}><SearchIcon/></span>
  </div>
  </>