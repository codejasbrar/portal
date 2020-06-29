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
import LabSlipApiService from "../../../services/LabSlipApiService";
import Spinner from "../../../components/Spinner/Spinner";

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
        <td style={{borderBottom: "1px solid #C3C8CD"}}>
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
        <td style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => updateDirection(0)}>{columnMeta.label}<span><SortIcon /></span></button>
        </td>
    }
  },
];

const options: MUIDataTableOptions = {
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  rowsPerPage: 25,
  selectToolbarPlacement: 'none',
  rowsPerPageOptions: [],
  rowHover: true,
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
  customFooter: CommonPagination,
  customToolbarSelect: () => <></>,
  customSearchRender: SearchBar,
  customToolbar: () => <></>,
} as MUIDataTableOptions;

const NoMatches = () => (
  <div className={styles.sorry}>
    <p className={styles.sorryText}>
      No results found
    </p>
  </div>
);

const reformatDate = (order: Order) => {
  const date = new Date(order.received);
  return {
    ...order,
    received: `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
  }
};

const ApprovedOrdersPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  let [width, setWidth] = useState(getWidth());

  useEffect(() => {
    (async () => {
      const response = await LabSlipApiService.getOrdersByStatus('APPROVED');
      setData(response.data);
      // setData(response.data.sort(((a: any, b: any) => {
      //   const aDate = new Date(a.received);
      //   const bDate = new Date(b.received);
      //
      //   return aDate > bDate ? -1 : 1;
      // })));
      setLoading(false);
    })();

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
    .filter(searchFilter)
    // .sort(((a: any, b: any) => {
    //   const aDate = new Date(a.received);
    //   const bDate = new Date(b.received);
    //
    //   return aDate > bDate ? 1 : -1;
    // }));

  if (loading) {
    return <Spinner />;
  }

  return <section className={styles.orders}>
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Approved</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={data.map(reformatDate)}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.ordersResultsInfo}>({ordersToView.length} results)</p>
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
              <p className={styles.mobileOrdersTitle}>Criteria
                met: <span className={styles.mobileOrdersText}>{item.criteriaMet ? "Yes" : "No"}</span></p>
            </div>
          ))}
        {ordersToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
}

export default ApprovedOrdersPage;