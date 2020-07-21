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
import {useDispatch, useSelector} from "react-redux";
import {ordersApprovedState} from "../../../selectors/selectors";
import {loadOrdersByStatus} from "../../../actions/ordersActions";
import Pagination from "../../../components/Table/Pagination/Pagination";
import Spinner from "../../../components/Spinner/Spinner";
import {
  getWidth,
  itemsToView,
  NoMatches,
  reformatDate,
  useResizeListener
} from "../PendingOrdersPage/PendingOrdersPage";

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
        </td>
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
    name: "approved",
    label: "Approved",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer, updateDirection: (params: any) => any) =>
        <td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => updateDirection(0)}>{columnMeta.label}<span><SortIcon /></span></button>
        </td>
    }
  },
];

const options = (onSearch: (count: number) => void) => ({
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  rowsPerPage: 25,
  selectToolbarPlacement: 'none',
  rowsPerPageOptions: [25],
  rowHover: true,
  pagination: false,
  customFooter: (rowCount) => onSearch(rowCount),
  selectableRows: 'none',
  textLabels: {
    body: {
      noMatch: "No results found",
    }
  },
  customSort(items, index, isDesc) {
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
  customToolbarSelect: () => <></>,
  customSearchRender: SearchBar,
  customToolbar: () => <></>,
}) as MUIDataTableOptions;

const ApprovedOrdersPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchItemsCount, setCount] = useState(0);
  const [data, setData] = useState({} as OrdersResponse);
  const [searchText, setSearchText] = useState('');
  const width = useResizeListener();
  const [page, setPage] = useState(0);
  const orders = useSelector(ordersApprovedState);

  useEffect(() => {
    if (orders.content && orders.content.length) {
      setData({
        ...orders, content: orders.content.map((item: Order) => {
          item.criteriaMet = item.criteriaMet ? "Yes" : 'No';
          return item;
        })
      });
    }
  }, [orders]);

  useEffect(() => {
    if (orders.content && orders.content.length) onSaved();
  }, [page]);

  const onSaved = async () => {
    setLoading(true);
    await dispatch(loadOrdersByStatus('APPROVED', page));
    setLoading(false);
  };

  useEffect(() => {
    onSaved();
  }, []);


  const ordersToView = itemsToView(data, searchText);

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
          data={data.content ? data.content.map(reformatDate) : []}
          columns={columns}
          options={options(setCount)}
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
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {ordersToView
          .map((item: any, i) => (
            <div key={i} className={styles.mobileOrdersItem}>
              <p className={styles.mobileOrdersTitle}>Order
                ID: <span className={styles.mobileOrdersText}>{item.id}</span></p>
              <p className={styles.mobileOrdersTitle}>Received: <span className={styles.mobileOrdersText}>{item.received}</span>
              </p>
              <p className={styles.mobileOrdersTitle}>Customer
                ID: <span className={styles.mobileOrdersText}>{item.customerId}</span></p>
              <p className={styles.mobileOrdersTitle}>Approved: <span className={styles.mobileOrdersText}>{item.approved}</span></p>
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

export default ApprovedOrdersPage;
