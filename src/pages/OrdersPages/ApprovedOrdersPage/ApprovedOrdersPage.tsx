import React from 'react';
import styles from "../OrdersPages.module.scss";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {
  MUIDataTableCustomHeadRenderer,
  MUIDataTableMeta,
  MUIDataTableOptions
} from "mui-datatables";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import {ordersApprovedState, resultsQuantity} from "../../../selectors/selectors";
import Pagination from "../../../components/Table/Pagination/Pagination";
import Spinner from "../../../components/Spinner/Spinner";
import {
  customDateColumnRender, customHeadSortRender,
  NoMatches, tableBaseOptions, usePageState,
  useResizeListener
} from "../PendingOrdersPage/PendingOrdersPage";

import LabSlipApiService from "../../../services/LabSlipApiService";
import {useSelector} from "react-redux";

const columns = (sortParam: string, onSort: (sortParam: string) => void) => [
  {
    name: "id",
    label: "Order ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
    }
  },
  {
    name: "received",
    label: "Received",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
      customBodyRender: customDateColumnRender
    }
  },
  {
    name: "customerId",
    label: "Customer ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
    }
  },
  {
    name: "approved",
    label: "Approved",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
      customBodyRender: customDateColumnRender
    }
  },
  {
    name: "hash",
    label: "Lab Slip",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: string, tableMeta: MUIDataTableMeta) => {
        const fileName = `${tableMeta.rowData[2]}_${tableMeta.rowData[0]}_labslip.pdf`;
        return <button type="button"
          className={styles.downloadLink}
          onClick={() => getLabSlip(value, fileName)}>Download</button>
      }
    }
  }
];

const options = (searchText: string, setSearchText: (searchText: string) => void) => ({
  ...tableBaseOptions,
  customSearchRender: () => SearchBar(searchText, setSearchText, false, undefined),
}) as MUIDataTableOptions;

const getLabSlip = async (hash: string, fileName: string) => {
  try {
    const response = await LabSlipApiService.getLabSlip(hash);
    const blob = new Blob([response.data], {type: "application/pdf"});
    const link = window.URL.createObjectURL(blob);
    // Open PDF in new Tab
    window.open(link, '_blank');
    // Download PDF file without opening
    const name = fileName;
    const linkEl = document.createElement('a');
    linkEl.href = link;
    linkEl.download = name;
    linkEl.target = '_blank';
    linkEl.click();
  } catch (e) {
    if (e.response) window.confirm(e.response.data.message);
  }
};

const ApprovedOrdersPage = () => {
  const width = useResizeListener();
  const [loading, orders, page, sort, onSort, setPage, searchText, setSearchText] = usePageState('order', 'APPROVED', ordersApprovedState);
  const ordersToView = orders.content || [];
  const count = useSelector(resultsQuantity).approvedOrders;

  return <section className={styles.orders}>
    {loading && <Spinner />}
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Approved orders</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={orders.content || []}
          columns={columns(sort.param, onSort)}
          options={options(searchText, setSearchText)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={orders.totalPages}
          itemsPerPage={orders.size}
          searchItems={ordersToView.length}
          totalItems={orders.totalElements} />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.ordersResultsInfo}>({count || 0} results)</p>
        <SearchBarMobile value={searchText} onChange={setSearchText} />
        {ordersToView
          .map((item: any, i: number) => (
            <div key={i} className={styles.mobileOrdersItem}>
              <p className={styles.mobileOrdersTitle}>Order
                ID: <span className={styles.mobileOrdersText}>{item.id}</span></p>
              <p className={styles.mobileOrdersTitle}>Received: <span className={styles.mobileOrdersText}>{item.received.replace('T', ' ')}</span>
              </p>
              <p className={styles.mobileOrdersTitle}>Customer
                ID: <span className={styles.mobileOrdersText}>{item.customerId}</span></p>
              <p className={styles.mobileOrdersTitle}>Criteria
                met: <span className={styles.mobileOrdersText}>{item.criteriaMet ? "Yes" : "No"}</span></p>
              <p className={styles.mobileOrdersTitle}>Approved: <span className={styles.mobileOrdersText}>{item.approved.replace('T', ' ')}</span>
              </p>
              <button type="button"
                onClick={() => getLabSlip(item.hash, `${item.customerId}_${item.id}_labslip.pdf`)}
                className={`${styles.mobileOrdersTitle} ${styles.downloadLink}`}>Download LabSlip
              </button>
            </div>
          ))}
        <Pagination mobile
          page={page}
          setPage={setPage}
          totalPages={orders.totalPages}
          itemsPerPage={orders.size}
          searchItems={ordersToView.length}
          totalItems={orders.totalElements} />
        {ordersToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
}

export default ApprovedOrdersPage;
