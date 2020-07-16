import React from "react";
import styles from "../Navigation/CommonPagination.module.scss";
import {ReactComponent as ArrowIcon} from "../../../icons/arrow.svg";

type CommonPaginationPropsTypes = {
  page: number,
  totalPages: number,
  setPage: (page: number) => void,
  totalItems: number,
  itemsPerPage: number,
  searchItems: number,
  mobile?: boolean,
}

const Pagination = (props: CommonPaginationPropsTypes) => {
  const lastPageItems = props.itemsPerPage - ((props.itemsPerPage * props.totalPages) - props.totalItems);
  return <div className={`${styles.pagination} ${props.mobile ? styles.paginationMobile : ''}`}>
    <div className={styles.paginationWrap}>
      {props.totalItems && <><span className={styles.text}>Showing results </span>
        {props.searchItems && (props.searchItems === props.itemsPerPage || (props.searchItems === lastPageItems && props.page + 1 === props.totalPages)) ?
          <strong>{props.page * props.itemsPerPage + 1}-{props.page * props.itemsPerPage + props.itemsPerPage > props.totalItems ? props.totalItems : props.page * props.itemsPerPage + props.itemsPerPage} </strong> :
          <strong>{props.searchItems} </strong>}
        of <strong>{props.totalItems} </strong></>}
    </div>
    {props.totalPages > 1 &&
    <div className={`${styles.paginationArrows} ${props.mobile ? styles.paginationArrowsMobile : ''}`}>
      <button className={styles.arrowLeft} disabled={props.page === 0} onClick={() => props.setPage(props.page - 1)}>
        <ArrowIcon />
      </button>
      <span className={styles.text}>Page <strong>{props.page + 1}</strong> of <strong>{props.totalPages}</strong></span>
      <button className={styles.arrowRight}
        disabled={props.page === props.totalPages - 1}
        onClick={() => props.setPage(props.page + 1)}>
        <ArrowIcon />
      </button>
    </div>
    }
  </div>
};

export default Pagination;