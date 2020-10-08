import React, {useEffect, useMemo, useState} from 'react';

import styles from "../OrdersPages.module.scss";

import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import {debounce} from "@material-ui/core";
import {ReactComponent as SortIcon} from "../../../icons/sort.svg";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import {Order, OrdersResponse} from "../../../interfaces/Order";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import Spinner from "../../../components/Spinner/Spinner";
import Pagination from "../../../components/Table/Pagination/Pagination";
import {loadOrdersByStatus} from "../../../actions/ordersActions";
import {useDispatch, useSelector} from "react-redux";
import {isAdmin, ordersPendingState, resultsQuantity} from "../../../selectors/selectors";
import {OrderStatus, SortDirection, TestStatus} from "../../../services/LabSlipApiService";
import {loadTestsByStatus} from "../../../actions/testsActions";
import {TestDetails} from "../../../interfaces/Test";

export const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

export const customDateColumnRender = (value: string) => {
  const date = value.slice(0, value.indexOf('T'));
  const time = value.slice(value.indexOf('T') + 1, value.length);
  return <>
    <div>{date}</div>
    <div>{time}</div>
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
      items.map((item: Order) => item.id)
    } catch (e) {
      setSelectedRows([]);
      return <></>;
    }
    return <ApproveButton mode="order"
      text={"Approve orders"}
      onSaved={onSaved}
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

export const reformatItem = (order: Order | TestDetails): any => {
  const offsetHours = new Date().getTimezoneOffset() / 60;
  const dateReceived = new Date(order.received);
  const dateApproved = order.approved ? new Date(order.approved) : '';
  const dateObserved = order.observed ? new Date(order.observed) : '';
  dateReceived.setHours(dateReceived.getHours() - offsetHours);
  if (dateApproved) dateApproved.setHours(dateApproved.getHours() - offsetHours);
  if (dateObserved) dateObserved.setHours(dateObserved.getHours() - offsetHours);
  return {
    ...order,
    criteriaMet: order.criteriaMet ? "Yes" : 'No',
    received: `${dateReceived.getMonth() + 1}/${dateReceived.getDate()}/${dateReceived.getFullYear()}T${dateReceived.toLocaleTimeString()}`,
    approved: dateApproved ? `${dateApproved.getMonth() + 1}/${dateApproved.getDate()}/${dateApproved.getFullYear()}T${dateApproved.toLocaleTimeString()}` : '',
    observed: dateObserved ? `${dateObserved.getMonth() + 1}/${dateObserved.getDate()}/${dateObserved.getFullYear()}T${dateObserved.toLocaleTimeString()}` : ''
  }
};

export const useResizeListener = () => {
  const [width, setWidth] = useState(getWidth());
  useEffect(() => {
    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  });
  return width;
};

export const useData = (selector: (store: Storage) => OrdersResponse) => {
  const [data, setData] = useState({} as OrdersResponse);
  const items: OrdersResponse = useSelector(selector);

  useEffect(() => {
    if (items.content) {
      console.log(items.content);
      setData({
        ...items, content: items.content.map(reformatItem)
      })
    }
  }, [items]);

  return data;
};

export const usePageState = (type: "order" | "test", status: string, selector: (store: Storage) => OrdersResponse) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [searchParams, setSearchParams] = useState({
    page: 0,
    sort: {param: 'received', direction: 'desc' as SortDirection},
    searchString: ''
  });
  const items = useData(selector);

  const onSearch = (value: string) => {
    setSearchParams({...searchParams, page: 0, searchString: value});
  };

  const onSetPage = (page: number) => {
    setSearchParams({...searchParams, page: page})
  };

  const debouncedSearch = useMemo(() => debounce(onSearch, 700), [searchParams.searchString]);

  useEffect(() => {
    debouncedSearch(searchText && searchText.length > 1 ? searchText : '');
  }, [searchText]);

  const onSaved = async () => {
    setLoading(true);
    if (type === 'order') await dispatch(loadOrdersByStatus(status as OrderStatus, searchParams.page, searchParams.sort.param, searchParams.sort.direction, searchParams.searchString));
    if (type === 'test') await dispatch(loadTestsByStatus(status as TestStatus, searchParams.page, searchParams.sort.param, searchParams.sort.direction, searchParams.searchString));
    setLoading(false);
  };

  useEffect(() => {
    onSaved();
  }, [searchParams.page, searchParams.sort, searchParams.searchString]);


  const onSort = (sortParam: string = 'received') => {
    setSearchParams({
      ...searchParams,
      page: 0,
      sort: {param: sortParam, direction: searchParams.sort.direction === 'desc' ? 'asc' : 'desc'}
    })
  };

  return [loading, items as OrdersResponse, searchParams.page as number, searchParams.sort as any, onSort, onSetPage, searchText, setSearchText, onSaved]
};

const PendingOrdersPage = () => {
  const admin = useSelector(isAdmin);
  const width = useResizeListener();
  const [loading, orders, page, sort, onSort, setPage, searchText, setSearchText, onSaved] = usePageState('order', 'PENDING', ordersPendingState);
  const count = useSelector(resultsQuantity).pendingOrders;

  const ordersToView = orders.content || [];

  const onSelect = (selectedRows: { index: number, dataIndex: number }[]) => selectedRows.map(row => orders.content[row.index]);

  return <section className={styles.orders}>
    {loading && <Spinner />}
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
        <ApproveButton mode="order" onSaved={onSaved} selected={orders.content} text={"Approve all orders"} />}
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
}

export default PendingOrdersPage;
