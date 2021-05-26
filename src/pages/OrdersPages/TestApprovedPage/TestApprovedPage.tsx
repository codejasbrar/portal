import React from 'react';
import styles from "../OrdersPages.module.scss";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import {
  customDateColumnRender, customHeadSortRender,
  NoMatches, tableBaseOptions,
} from "../PendingOrdersPage/PendingOrdersPage";
import {Test} from "../../../interfaces/Test";
import Pagination from "../../../components/Table/Pagination/Pagination";
import Spinner from "../../../components/Spinner/Spinner";
import {Order, OrdersResponse} from "../../../interfaces/Order";
import useResizeListener from "../../../hooks/useResizeListener";
import usePageState from "../../../hooks/usePageState";
import {observer} from "mobx-react";
import CountersStore from "../../../stores/CountersStore";
import TestsStore from "../../../stores/TestsStore";

const columns = (onClickLink: (id: number) => Test, sortParam: string, onSort: (sortParam: string) => void) => [
  {
    name: "id",
    label: "Test result ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
      customBodyRender: (value: any) => {
        const link = onClickLink(value);
        return link && <Link
          to={`/orders/test/${link.hash}`} /*need page refresh*/
          color="secondary"
        >{value}</Link>
      }
    }
  },
  {
    name: "observed",
    label: "Collected",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
      customBodyRender: customDateColumnRender
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
    name: "orderId",
    label: "Order ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
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
];

const options = (searchText: string, setSearchText: (searchText: string) => void) => ({
  ...tableBaseOptions,
  customSearchRender: () => SearchBar(searchText, setSearchText, false, undefined),
} as MUIDataTableOptions);

const TestApprovedPage = observer(() => {
  const width = useResizeListener();
  const {approved} = TestsStore;
  const [tests, page, sort, onSort, setPage, searchText, setSearchText] = usePageState('test', 'APPROVED', approved as OrdersResponse);
  const count = CountersStore.counters.approvedResults;
  const testsToView = tests.content || [];

  const onClickLink = (id: number) => tests.content.filter((test: Order) => test.id === id)[0];

  return <section className={styles.tests}>
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Approved test results</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={tests.content || []}
          columns={columns(onClickLink, sort.param, onSort)}
          options={options(searchText, setSearchText)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={tests.totalPages}
          itemsPerPage={tests.size}
          searchItems={testsToView.length}
          totalItems={tests.totalElements} />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.testsResultsInfo}>({count || 0} results)</p>
        <SearchBarMobile value={searchText} onChange={setSearchText} />
        {testsToView
          .map((item: any, i: number) => (
            <div key={i} className={styles.mobileOrdersItem}>
              <p className={styles.mobileOrdersTitle}>Test result ID: <span className={styles.mobileOrdersText}><Link
                className={styles.mobileTestsLink}
                to={`/orders/test/${item.hash}`}
              >{item.id}</Link></span></p>
              <p className={styles.mobileOrdersTitle}>Collected: <span className={styles.mobileOrdersText}>{item.observed.replace('T', ' ')}</span>
              </p>
              <p className={styles.mobileOrdersTitle}>Received: <span className={styles.mobileOrdersText}>{item.received.replace('T', ' ')}</span>
              </p>
              <p className={styles.mobileOrdersTitle}>Order
                ID: <span className={styles.mobileOrdersText}>{item.orderId}</span>
              </p>
              <p className={styles.mobileOrdersTitle}>Customer
                ID: <span className={styles.mobileOrdersText}>{item.customerId}</span></p>
              {/*<p className={styles.mobileOrdersTitle}>Criteria*/}
              {/*  met: <span className={styles.mobileOrdersText}>{item.criteriaMet ? "Yes" : "No"}</span></p>*/}
              <p className={styles.mobileOrdersTitle}>Approved: <span className={styles.mobileOrdersText}>{item.approved.replace('T', ' ')}</span>
              </p>
            </div>
          ))}
        <Pagination mobile
          page={page}
          setPage={setPage}
          totalPages={tests.totalPages}
          itemsPerPage={tests.size}
          searchItems={testsToView.length}
          totalItems={tests.totalElements} />
        {testsToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
});

export default TestApprovedPage;

