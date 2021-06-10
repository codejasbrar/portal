import React, {useEffect} from 'react';

import styles from "../OrdersPages.module.scss";

import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import {ReactComponent as SortIcon} from "../../../icons/sort.svg";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import {Order, OrdersResponse} from "../../../interfaces/Order";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import Pagination from "../../../components/Table/Pagination/Pagination";
import Checkbox from "@material-ui/core/Checkbox";
import usePageState from "../../../hooks/usePageState";
import useResizeListener from "../../../hooks/useResizeListener";
import CountersStore from "../../../stores/CountersStore";
import {observer} from "mobx-react";
import UserStore from "../../../stores/UserStore";
import OrdersStore from "../../../stores/OrdersStore";

export const customDateColumnRender = (value: string) => {
  const date = value.slice(0, value.indexOf('T'));
  const time = value.slice(value.indexOf('T') + 1, value.lastIndexOf('.') || value.length);
  return <>
    <p style={{whiteSpace: 'nowrap'}}>{date}</p>
    <p style={{whiteSpace: 'nowrap'}}>{time}</p>
  </>
};

export const customHeadSortRender = (columnMeta: MUIDataTableCustomHeadRenderer, sortParam: string, onSort: (sortParam: string) => void) =>
  <td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
    <button className={styles.sortBlock}
      onClick={() => onSort(columnMeta.name)}>{columnMeta.label}<span><SortIcon className={`${styles.sortIcon} ${sortParam === columnMeta.name ? styles.sortIconActive : ''}`} /></span>
    </button>
  </td>;

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
    name: "criteriaMet",
    label: "Criteria met",
    options: {
      filter: true,
      sort: false,
    }
  },
];

export const tableComponents = {
  Checkbox: Checkbox
};

export const tableBaseOptions = {
  filterType: 'checkbox',
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  rowsPerPage: 25,
  pagination: false,
  selectToolbarPlacement: 'above',
  rowsPerPageOptions: [25],
  rowHover: true,
  selectableRows: 'none',
  textLabels: {
    body: {
      noMatch: "No results found",
    }
  },
  customToolbar: () => '',
  customFooter: () => <></>
};

const options = (onSelect: any, onSaved: any, isAdmin: boolean, searchText: string, setSearchText: (searchText: string) => void) => ({
  ...tableBaseOptions,
  selectableRows: isAdmin ? 'none' : 'multiple',
  customToolbarSelect: (selected, data, setSelectedRows) => {
    const items = onSelect(selected.data);
    try {
      items.map((item: Order) => item.id);
    } catch (e) {
      setSelectedRows([]);
      return <></>;
    }
    return <ApproveButton mode="order"
      text={"Approve orders"}
      onSaved={onSaved}
      onSelected={setSelectedRows}
      selected={items} />;
  },
  customSearchRender: () => SearchBar(searchText, setSearchText, false, undefined),
} as MUIDataTableOptions);

export const NoMatches = () => (
  <div className={styles.sorry}>
    <p className={styles.sorryText}>
      No results found
    </p>
  </div>
);

const PendingOrdersPage = observer(() => {
  const admin = UserStore.isAdmin;
  const width = useResizeListener();
  const {pending} = OrdersStore;
  const [orders, page, sort, onSort, setPage, searchText, setSearchText, onSaved] = usePageState('order', 'PENDING', pending as OrdersResponse);
  const count = CountersStore.counters.pendingOrders;
  const ordersToView = orders.content || [];

  const onSelect = (selectedRows: { index: number, dataIndex: number }[]) => selectedRows.map(row => orders.content[row.index]);

  return <section className={styles.orders}>
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Pending approval orders</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={ordersToView}
          columns={columns(sort.param, onSort)}
          options={options(onSelect, onSaved, admin, searchText, setSearchText)}
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
        {!admin &&
        <ApproveButton mode="order" onSaved={onSaved} selected={orders.content} text={"Approve all orders"} mobile />}
        <SearchBarMobile value={searchText} onChange={setSearchText} />
        {ordersToView
          .map((item: any, i: any) => (
            <div key={i} className={styles.mobileOrdersItem}>
              <p className={styles.mobileOrdersTitle}>Order
                ID: <span className={styles.mobileOrdersText}>{item.id}</span></p>
              <p className={styles.mobileOrdersTitle}>Received: <span className={styles.mobileOrdersText}>{item.received.replace('T', ' ')}</span>
              </p>
              <p className={styles.mobileOrdersTitle}>Customer
                ID: <span className={styles.mobileOrdersText}>{item.customerId}</span></p>
              <p className={styles.mobileOrdersTitle}>Criteria
                met: <span className={styles.mobileOrdersText}>{item.criteriaMet ? "Yes" : "No"}</span></p>
              {!admin && <ApproveButton className={styles.btnApproveMobile}
                mode="order"
                onSaved={onSaved}
                selected={[item]}
                text={"Approve"}
                mobile
              />}
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
});

export default PendingOrdersPage;
