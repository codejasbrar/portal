import React from "react";
import styles from "../Navigation/CommonPagination.module.scss";
import {ReactComponent as ArrowIcon} from "../../../icons/arrow.svg";
import {ReactComponent as DangerIcon} from "../../../icons/danger.svg";

type CommonPaginationPropsTypes = {
  page: number,
  totalPages: number,
  setPage: (page: number) => void,
  totalItems: number,
  itemsPerPage: number,
  searchItems: number,
  mobile?: boolean,
  legend?: boolean,
}

const Pagination = (props: CommonPaginationPropsTypes) => {
  const {legend, itemsPerPage, searchItems, page, totalItems, totalPages, mobile, setPage} = props;
  const lastPageItems = itemsPerPage - ((itemsPerPage * totalPages) - totalItems);
  return <div className={`${styles.pagination} ${mobile ? styles.paginationMobile : ''}`}>
    <div className={styles.paginationWrap}>
      {totalItems > 0 && <><span className={styles.text}>Showing results </span>
        {searchItems && (searchItems === itemsPerPage || (searchItems === lastPageItems && page + 1 === totalPages)) ?
          <strong>{page * itemsPerPage + 1}-{page * itemsPerPage + itemsPerPage > totalItems ? totalItems : page * itemsPerPage + itemsPerPage} </strong> :
          <strong>{searchItems} </strong>}
        of <strong>{totalItems} </strong></>}
    </div>
    {legend && <div className={styles.paginationLegend}>
      <DangerIcon className={styles.paginationLegendIcon} /> Results with a panic value
    </div>}
    {totalPages > 1 &&
    <div className={`${styles.paginationArrows} ${mobile ? styles.paginationArrowsMobile : ''}`}>
      <button className={styles.arrowLeft} disabled={page === 0} onClick={() => setPage(page - 1)}>
        <ArrowIcon />
      </button>
      <span className={styles.text}>Page <strong>{page + 1}</strong> of <strong>{totalPages}</strong></span>
      <button className={styles.arrowRight}
        disabled={page === totalPages - 1}
        onClick={() => setPage(page + 1)}>
        <ArrowIcon />
      </button>
    </div>
    }
  </div>
};

export default Pagination;
