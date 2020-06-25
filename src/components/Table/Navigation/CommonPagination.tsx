import React from "react";
import styles from "./CommonPagination.module.scss";
import {ReactComponent as ArrowIcon} from "../../../icons/arrow.svg";

export default (
  rowCount: number,
  page: number,
  rowsPerPage: number,
  changeRowsPerPage: (page: string | number) => void,
  changePage: (newPage: number) => void
) => <>
  {rowCount > 0 &&
  <div className={styles.pagination}>
    <div className={styles.paginationWrap}>
      <span className={styles.text}>Showing results </span>
      <strong>{page * rowsPerPage + 1}-{page * rowsPerPage + rowsPerPage > rowCount ? rowCount : page * rowsPerPage + rowsPerPage} </strong>
      of <strong> {rowCount} </strong>
    </div>
    {rowCount - rowsPerPage > 0 &&
    <div className={styles.paginationArrows}>
      <button className={styles.arrowLeft} disabled={page === 0} onClick={() => changePage(page - 1)}><ArrowIcon />
      </button>
      <span className={styles.text}>Page <strong>{page + 1}</strong> of <strong>{Math.floor(rowCount / rowsPerPage + 1)}</strong></span>
      <button className={styles.arrowRight}
        disabled={rowCount / rowsPerPage < page + 1}
        onClick={() => changePage(page + 1)}>
        <ArrowIcon />
      </button>
    </div>
    }
  </div>
  }
</>