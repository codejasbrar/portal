import React, {useEffect, useState} from 'react';

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
import Spinner from "../../../components/Spinner/Spinner";
import Pagination from "../../../components/Table/Pagination/Pagination";
import {loadOrdersByStatus} from "../../../actions/ordersActions";
import {useDispatch, useSelector} from "react-redux";
import {isAdmin, ordersPendingState} from "../../../selectors/selectors";
import {Test, TestDetails} from "../../../interfaces/Test";
import {OrderStatus, SortDirection, TestStatus} from "../../../services/LabSlipApiService";
import {loadTestsByStatus} from "../../../actions/testsActions";

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

const options = (onSelect: any, onSaved: any, onSearch: (count: number) => void, isAdmin: boolean) => ({
  filterType: 'checkbox',
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  customFooter: (rowCount) => onSearch(rowCount),
  rowsPerPage: 25,
  pagination: false,
  selectableRows: isAdmin ? 'none' : 'multiple',
  selectToolbarPlacement: 'above',
  rowsPerPageOptions: [25],
  rowHover: true,
  textLabels: {
    body: {
      noMatch: "No results found",
    }
  },
  customToolbar: () => '',
  customToolbarSelect: (selected) => {
    return <ApproveButton mode="order"
      text={"Approve orders"}
      onSaved={onSaved}
      selected={onSelect(selected.data)} />;
  },
  customSearchRender: SearchBar,
} as MUIDataTableOptions);

export const NoMatches = () => (
  <div className={styles.sorry}>
    <p className={styles.sorryText}>
      No results found
    </p>
  </div>
);

export const reformatDate = (order: Order | Test | TestDetails) => {
  const offsetHours = new Date().getTimezoneOffset() / 60;
  const dateReceived = new Date(order.received);
  const dateApproved = order.approved ? new Date(order.approved) : '';
  dateReceived.setHours(dateReceived.getHours() - offsetHours);
  if (dateApproved) dateApproved.setHours(dateApproved.getHours() - offsetHours);
  return {
    ...order,
    received: `${dateReceived.getMonth() + 1}/${dateReceived.getDate()}/${dateReceived.getFullYear()}T${dateReceived.toLocaleTimeString()}`,
    approved: dateApproved ? `${dateApproved.getMonth() + 1}/${dateApproved.getDate()}/${dateApproved.getFullYear()}T${dateApproved.toLocaleTimeString()}` : ''
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
    if (items.content && items.content.length) {
      setData({
        ...items, content: items.content.map((item: Order) => {
          item.criteriaMet = item.criteriaMet ? "Yes" : 'No';
          return item;
        })
      })
    }
  }, [items]);

  return data;
};

export const itemsToView = (data: OrdersResponse, searchText: string) => data.content ? data.content
  .map(reformatDate)
  .filter((item: any) => (String(item.id).indexOf(searchText) !== -1) || (String(item.customerId).indexOf(searchText) !== -1) ? 1 : 0) : [];

export const usePageState = (type: "order" | "test", status: string, selector: (store: Storage) => OrdersResponse) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({param: 'received', direction: 'desc' as SortDirection});
  const items = useData(selector);

  useEffect(() => {
    if (items.content && items.content.length) onSaved();
  }, [page, sort]);

  const onSaved = async () => {
    setLoading(true);
    if (type === 'order') await dispatch(loadOrdersByStatus(status as OrderStatus, page, sort.param, sort.direction));
    if (type === 'test') await dispatch(loadTestsByStatus(status as TestStatus, page, sort.param, sort.direction));
    setLoading(false);
  };

  const onSort = (sortParam: string = 'received') => {
    setSort({param: sortParam, direction: sort.direction === 'desc' ? 'asc' : 'desc'});
    setPage(0);
  };

  useEffect(() => {
    onSaved();
  }, []);

  return [loading, items as OrdersResponse, page as number, sort as any, onSort, setPage, onSaved]
};

const PendingOrdersPage = () => {
  const [searchText, setSearchText] = useState('');
  const [searchItemsCount, setCount] = useState(0);
  const admin = useSelector(isAdmin);
  const width = useResizeListener();
  const [loading, orders, page, sort, onSort, setPage, onSaved] = usePageState('order', 'PENDING', ordersPendingState);

  const ordersToView = itemsToView(orders, searchText);

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
          data={orders.content ? orders.content.map(reformatDate) : []}
          columns={columns(sort.param, onSort)}
          options={options(onSelect, onSaved, setCount, admin)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={orders.totalPages}
          itemsPerPage={orders.size}
          searchItems={searchItemsCount}
          totalItems={orders.totalElements} />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.ordersResultsInfo}>({orders.totalElements || 0} results)</p>
        {!admin &&
        <ApproveButton mode="order" onSaved={onSaved} selected={orders.content} text={"Approve all orders"} />}
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
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
                text={"Approve"} />}
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
