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
import {Order, OrdersResponse} from "../../../interfaces/Order";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import {reformatDate} from "../ApprovedOrdersPage/ApprovedOrdersPage";
import LabSlipApiService from "../../../services/LabSlipApiService";
import Spinner from "../../../components/Spinner/Spinner";
import Pagination from "../../../components/Table/Pagination/Pagination";

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

const options = (onSelect: any, onSaved: any, page: number, setPage: (page: number) => void, totalElements: number, totalPages: number, size: number) => ({
  filterType: 'checkbox',
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  customFooter: CommonPagination,
  rowsPerPage: 250,
  pagination: false,
  selectableRows: 'multiple',
  selectToolbarPlacement: 'above',
  rowsPerPageOptions: [250],
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
    const displayedSelectedRows = selected.data
      .filter((item: any) => displayData.find((currentItem) => currentItem.dataIndex === item.dataIndex));

    if (displayedSelectedRows.length == 0) {
      setSelectedRows([]);
    }

    return <ApproveButton mode="order"
    text={"Approve orders"}
    onSaved={onSaved}
    selected={onSelect(displayedSelectedRows)} />;
    },
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
  const [data, setData] = useState({} as OrdersResponse);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(getWidth());


  const onLoad = (data: OrdersResponse) => {
    if (data.content && data.content.length) {
      setData({
        ...data, content: data.content.map((item: Order) => {
          item.criteriaMet = item.criteriaMet ? "Yes" : 'No';
          return item;
        })
      });
    }
  };

  useEffect(() => {
    onSaved();
  }, [page]);

  const onSaved = async () => {
    setLoading(true);
    const resp = await LabSlipApiService.getOrdersByStatus('PENDING', page);
    onLoad(resp);
    setLoading(false);
  };

  useEffect(() => {
    onSaved();
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

  const ordersToView = data.content ? data.content
    .map(reformatDate)
    .filter(searchFilter) : [];

  const onSelect = (selectedRows: { index: number, dataIndex: number }[]) => selectedRows.map(row => data.content[row.index]);

  return <section className={styles.orders}>
    {loading && <Spinner />}
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Orders pending approval</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={data.content ? data.content.map(reformatDate) : []}
          columns={columns}
          options={options(onSelect, onSaved, page, setPage, data.totalElements, data.totalPages, data.size)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={data.totalPages}
          itemsPerPage={data.size}
          totalItems={data.totalElements} />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.ordersResultsInfo}>({ordersToView.length} results)</p>
        <ApproveButton mode="order" onSaved={onSaved} selected={data.content} text={"Approve all orders"} />
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
