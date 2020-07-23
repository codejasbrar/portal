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
import {ordersPendingState} from "../../../selectors/selectors";
import {Test, TestDetails} from "../../../interfaces/Test";

export const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

export const customDateColumnRender = (value: string, tableMeta?: any, updateValue?: any) => {
  const date = value.slice(0, value.indexOf('T'));
  const time = value.slice(value.indexOf('T') + 1, value.length);
  return <>
    <div>{date}</div>
    <div>{time}</div>
  </>
};

const columns = [
  {
    name: "id",
    label: "Order ID",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "received",
    label: "Received",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer, updateDirection: (params: any) => any) =>
        <td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => updateDirection(0)}>{columnMeta.label}<span><SortIcon /></span></button>
        </td>,
      customBodyRender: customDateColumnRender
    }
  },
  {
    name: "customerId",
    label: "Customer ID",
    options: {
      filter: true,
      sort: false,
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

const options = (onSelect: any, onSaved: any, onSearch: (count: number) => void) => ({
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
  selectableRows: 'multiple',
  selectToolbarPlacement: 'above',
  rowsPerPageOptions: [25],
  rowHover: true,
  textLabels: {
    body: {
      noMatch: "No results found",
    }
  },
  customSort(items: any, index: number, isDesc: string) {
    items.sort((a: any, b: any) => {
      const aDate = new Date(a.data[index]);
      const bDate = new Date(b.data[index]);

      if (isDesc === 'asc') {
        return aDate > bDate ? -1 : 1;
      }

      return aDate > bDate ? 1 : -1;
    });
    return items;
  },
  customToolbar: () => '',
  customToolbarSelect: (selected, displayData, setSelectedRows) => {
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

export const itemsToView = (data: OrdersResponse, searchText: string) => data.content ? data.content
  .map(reformatDate)
  .filter((item: any) => (String(item.id).indexOf(searchText) !== -1) || (String(item.customerId).indexOf(searchText) !== -1) ? 1 : 0) : [];

const PendingOrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(ordersPendingState);
  const [data, setData] = useState({} as OrdersResponse);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [searchItemsCount, setCount] = useState(0);
  const width = useResizeListener();

  const onLoad = () => {
    if (orders.content && orders.content.length) {
      setData({
        ...orders, content: orders.content.map((item: Order) => {
          item.criteriaMet = item.criteriaMet ? "Yes" : 'No';
          return item;
        })
      });
    }
  };

  useEffect(() => {
    onLoad();
  }, [orders]);

  useEffect(() => {
    if (orders.content && orders.content.length) onSaved();
  }, [page]);

  const onSaved = async () => {
    setLoading(true);
    await dispatch(loadOrdersByStatus('PENDING', page));
    setLoading(false);
  };

  useEffect(() => {
    onSaved();
  }, []);

  const ordersToView = itemsToView(data, searchText);

  const onSelect = (selectedRows: { index: number, dataIndex: number }[]) => selectedRows.map(row => data.content[row.index]);

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
          data={data.content ? data.content.map(reformatDate) : []}
          columns={columns}
          options={options(onSelect, onSaved, setCount)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={data.totalPages}
          itemsPerPage={data.size}
          searchItems={searchItemsCount}
          totalItems={data.totalElements} />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.ordersResultsInfo}>({data.totalElements || 0} results)</p>
        <ApproveButton mode="order" onSaved={onSaved} selected={orders.content} text={"Approve all orders"} />
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
              <ApproveButton className={styles.btnApproveMobile}
                mode="order"
                onSaved={onSaved}
                selected={[item]}
                text={"Approve"} />
            </div>
          ))}
        <Pagination mobile
          page={page}
          setPage={setPage}
          totalPages={data.totalPages}
          itemsPerPage={data.size}
          searchItems={ordersToView.length}
          totalItems={data.totalElements} />
        {ordersToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
}

export default PendingOrdersPage;
