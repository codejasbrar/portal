import React from "react";
import styles from "../Navigation/CommonPagination.module.scss";
import {ReactComponent as ArrowIcon} from "../../../icons/arrow.svg";

type CommonPaginationPropsTypes = {
  page: number,
  totalPages: number,
  setPage: (page: number) => void,
  totalItems: number,
  itemsPerPage: number
}

const Pagination = (props: CommonPaginationPropsTypes) => {
  return <div className={styles.pagination}>
    <div className={styles.paginationWrap}>
      <span className={styles.text}>Showing results </span>
      <strong>{props.page * props.itemsPerPage + 1}-{props.page * props.itemsPerPage + props.itemsPerPage > props.totalItems ? props.totalItems : props.page * props.itemsPerPage + props.itemsPerPage} </strong>
      of <strong> {props.totalItems} </strong>
    </div>
    {props.totalPages > 1 &&
    <div className={styles.paginationArrows}>
      <button className={styles.arrowLeft} disabled={props.page === 0} onClick={() => props.setPage(props.page - 1)}>
        <ArrowIcon />
      </button>
      <span className={styles.text}>Page <strong>{props.page + 1}</strong> of <strong>{props.totalPages}</strong></span>
      <button className={styles.arrowRight}
        disabled={props.page === props.totalPages}
        onClick={() => props.setPage(props.page + 1)}>
        <ArrowIcon />
      </button>
    </div>
    }
  </div>
};

export default Pagination;