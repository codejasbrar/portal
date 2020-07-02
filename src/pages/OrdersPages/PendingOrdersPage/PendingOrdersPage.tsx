import React, {useEffect, useState} from 'react';

import styles from "../OrdersPages.module.scss";

import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import {ReactComponent as SortIcon} from "../../../icons/sort.svg";
import CommonPagination from "../../../components/Table/Navigation/CommonPagination";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import {Order} from "../../../interfaces/Order";
import {useDispatch, useSelector} from "react-redux";
import {loadOrdersByStatus} from "../../../actions/ordersActions";
import {ordersPendingState} from "../../../selectors/selectors";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import {reformatDate} from "../ApprovedOrdersPage/ApprovedOrdersPage";

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

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
    name: "criteriaMet",
    label: "Criteria met",
    options: {
      filter: true,
      sort: false,
    }
  },
];

const options = (onSelect: any, onSaved: any) => ({
  filterType: 'checkbox',
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  rowsPerPage: 25,
  selectableRows: 'multiple',
  selectToolbarPlacement: 'above',
  rowsPerPageOptions: [],
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
  selectableRowsOnClick: true,
  customFooter: CommonPagination,
  customToolbar: () => '',
  customToolbarSelect: (selected) => <ApproveButton mode="order"
    text={"Approve orders"}
    onSaved={onSaved}
    selected={onSelect(selected.data)} />,
  customSearchRender: SearchBar,
} as MUIDataTableOptions);


const NoMatches = () => (
  <div className={styles.sorry}>
    <p className={styles.sorryText}>
      No results found
    </p>
  </div>
);


const PendingOrdersPage = () => {
  const [data, setData] = useState([] as Order[]);
  const [searchText, setSearchText] = useState('');
  const [width, setWidth] = useState(getWidth());
  const dispatch = useDispatch();
  const orders = useSelector(ordersPendingState);

  const onSaved = async () => {
    dispatch(loadOrdersByStatus("APPROVED"));
    await dispatch(loadOrdersByStatus('PENDING'));
  };

  useEffect(() => {
    onLoad();
  }, [orders]);

  const onLoad = () => {
    if (orders && orders.length) {
      setData(orders.map((item: any) => {
        item.criteriaMet = item.criteriaMet ? "Yes" : 'No';
        return item;
      }));
    }
  };

  useEffect(() => {
    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  const searchFilter = (item: any) =>
    (String(item.id).indexOf(searchText) !== -1)
    || (String(item.customerId).indexOf(searchText) !== -1)
      ? 1 : 0;

  const ordersToView = data
    .map(reformatDate)
    .filter(searchFilter);

  const onSelect = (selectedRows: { index: number, dataIndex: number }[]) => selectedRows.map(row => data[row.index]);

  return <section className={styles.orders}>
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Orders pending approval</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={data.map(reformatDate)}
          columns={columns}
          options={options(onSelect, onSaved)}
        />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.ordersResultsInfo}>({ordersToView.length} results)</p>
        <ApproveButton mode="order" onSaved={onSaved} selected={data} text={"Approve all orders"} />
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {ordersToView
          .map((item: any, i: any) => (
            <div key={i} className={styles.mobileOrdersItem}>
              <p className={styles.mobileOrdersTitle}>Order
                ID: <span className={styles.mobileOrdersText}>{item.id}</span></p>
              <p className={styles.mobileOrdersTitle}>Received: <span className={styles.mobileOrdersText}>{item.received}</span>
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
        {ordersToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
}

export default PendingOrdersPage;
