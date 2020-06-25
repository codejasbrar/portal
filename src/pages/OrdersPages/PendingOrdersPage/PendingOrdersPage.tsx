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

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

function useCurrentWitdh() {
  let [width, setWidth] = useState(getWidth());

  useEffect(() => {
    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, [])

  return width;
}

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
        <>
          <button className={styles.sortBlock}
            onClick={() => updateDirection(1)}>{columnMeta.label}<span><SortIcon /></span></button>
        </>
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

const data = [
  {id: "23244", received: "4/23/2020", customerId: "33267", criteriaMet: true},
  {id: "9830", received: "4/23/2020", customerId: "33267", criteriaMet: false},
  {id: "9830", received: "4/23/2020", customerId: "33267", criteriaMet: false},
  {id: "7777", received: "7/23/2020", customerId: "7778", criteriaMet: true},
  {id: "9830", received: "4/23/2020", customerId: "33267", criteriaMet: false},
  {id: "7777", received: "7/23/2020", customerId: "7778", criteriaMet: true},
  {id: "9830", received: "4/23/2019", customerId: "33267", criteriaMet: false},
  {id: "7777", received: "7/23/2020", customerId: "7778", criteriaMet: true},
  {id: "9830", received: "4/23/2020", customerId: "33267", criteriaMet: false},
  {id: "7777", received: "7/23/2020", customerId: "7778", criteriaMet: true},
  {id: "9830", received: "4/23/2020", customerId: "33267", criteriaMet: false},
  {id: "7777", received: "7/23/2020", customerId: "7778", criteriaMet: true},
  {id: "9830", received: "4/23/2020", customerId: "33267", criteriaMet: false},
  {id: "7777", received: "7/23/2018", customerId: "7778", criteriaMet: true},
  {id: "9830", received: "4/23/2020", customerId: "33267", criteriaMet: false},
  {id: "7777", received: "7/23/2020", customerId: "7778", criteriaMet: true},
  {id: "7777", received: "7/23/2020", customerId: "7778", criteriaMet: true},
  {id: "9830", received: "9/23/2020", customerId: "33267", criteriaMet: false},
];

const options: MUIDataTableOptions = {
  filterType: 'checkbox',
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  rowsPerPage: 10,
  selectToolbarPlacement: 'none',
  rowsPerPageOptions: [],
  rowHover: true,
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
  customToolbarSelect: () => <>Selected toolbar</>,
  customSearchRender: SearchBar,
  customToolbar: () => <div>
    <button className={styles.btnPrimary}>Approved</button>
  </div>
} as MUIDataTableOptions;

const NoMatches = () => (
  <div className={styles.sorry}>
    <p className={styles.sorryText}>
      No results found
    </p>
  </div>
);

const PendingOrdersPage = () =>
  <section className={styles.orders}>
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Orders pending approval</h2>
    {useCurrentWitdh() > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={data}
          columns={columns}
          options={options}
        />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.ordersResultsInfo}>(3 results)</p>
        <button className={styles.btnPrimary}>Approve all orders</button>
        <SearchBarMobile />
        {data.map((item: any, i) => (
          <div key={i} className={styles.mobileOrdersItem}>
            <p className={styles.mobileOrdersTitle}>Order
              ID: <span className={styles.mobileOrdersText}>{item.id}</span></p>
            <p className={styles.mobileOrdersTitle}>Received: <span className={styles.mobileOrdersText}>{item.received}</span>
            </p>
            <p className={styles.mobileOrdersTitle}>Customer
              ID: <span className={styles.mobileOrdersText}>{item.customerId}</span></p>
            <p className={styles.mobileOrdersTitle}>Criteria
              met: <span className={styles.mobileOrdersText}>{item.criteriaMet ? "Yes" : "No"}</span></p>
            <button className={styles.btnPrimary}>Approve</button>
          </div>
        ))}
        {/*<NoMatches/>*/}
      </div>
    }
  </section>

export default PendingOrdersPage;
