import React, {useEffect, useState} from 'react';
import styles from "../OrdersPages.module.scss";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {
  MUIDataTableCustomHeadRenderer,
  MUIDataTableMeta,
  MUIDataTableOptions
} from "mui-datatables";
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
  customDateColumnRender,
  itemsToView,
  NoMatches,
  reformatDate,
  useResizeListener
} from "../PendingOrdersPage/PendingOrdersPage";

import LabSlipApiService from "../../../services/LabSlipApiService";

const columns = (onSort: (sortParam: 'received' | 'approved') => void, onClickDownload: (orderId: number) => void) => [
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
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) =>
        <td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => onSort('received')}>{columnMeta.label}<span><SortIcon /></span></button>
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
    name: "approved",
    label: "Approved",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) =>
        <td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => onSort('approved')}>{columnMeta.label}<span><SortIcon /></span></button>
        </td>,
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
  customToolbarSelect: () => <></>,
  customSearchRender: SearchBar,
  customToolbar: () => <></>,
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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchItemsCount, setCount] = useState(0);
  const [data, setData] = useState({} as OrdersResponse);
  const [searchText, setSearchText] = useState('');
  const width = useResizeListener();
  const [page, setPage] = useState(0);
  const [sortDirections, setSortDirections] = useState({'received': 'desc', 'approved': 'asc'} as any);
  const [currentSortParam, setSortParam] = useState('received');
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
  }, [page, sortDirections.received, sortDirections.approved]);

  const onSaved = async () => {
    setLoading(true);
    await dispatch(loadOrdersByStatus('APPROVED', page, currentSortParam, sortDirections[currentSortParam]));
    setLoading(false);
  };

  const onClickDownload = async (orderId: number) => {
    const orderHash = orders.content.filter(order => order.id === orderId)[0].hash;
    const labslip = await LabSlipApiService.getLabSlip(orderHash);
    console.log(labslip);
  };

  const onSort = (sortParam: 'received' | 'approved') => {
    if (sortParam !== currentSortParam) setSortParam(sortParam);
    if (sortParam === 'received') {
      setSortDirections({...sortDirections, received: sortDirections.received === 'desc' ? 'asc' : 'desc'})
    } else if (sortParam === 'approved') {
      setSortDirections({...sortDirections, approved: sortDirections.approved === 'desc' ? 'asc' : 'desc'})
    }
    setPage(0);
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
          columns={columns(onSort, onClickDownload)}
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
