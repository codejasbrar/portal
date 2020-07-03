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
import {useSelector} from "react-redux";
import {testsApprovedState} from "../../../selectors/selectors";
import {reformatDate} from "../ApprovedOrdersPage/ApprovedOrdersPage";
import {Test} from "../../../interfaces/Test";
import {log} from "util";
import {Order} from "../../../interfaces/Order";

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

const columns = (onClickLink: (id: number) => Test) => [
  {
    name: "id",
    label: "Test result ID",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
        const link = onClickLink(value).hash;
        return <Link
          to={`/orders/test/${link}`} /*need page refresh*/
          color="secondary"
        >{value}</Link>
      }
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
    name: "orderId",
    label: "Order ID",
    options: {
      filter: true,
      sort: false
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


const TestApprovedPage = () => {
  const [data, setData] = useState([] as Test[]);
  const [searchText, setSearchText] = useState('');
  const [width, setWidth] = useState(getWidth());
  const tests = useSelector(testsApprovedState);

  useEffect(() => {
    onLoad();
  }, [tests]);

  const onLoad = () => {
    if (tests && tests.length) setData(tests);
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

  const testsToView = data
    .map(reformatDate)
    .filter(searchFilter);

  const onClickLink = (id: number) => tests.filter(test => test.id === id)[0];

  return <section className={styles.tests}>
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Approved</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={data.map(reformatDate)}
          columns={columns(onClickLink)}
          options={options}
        />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.testsResultsInfo}>({testsToView.length} results)</p>
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {testsToView
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
        {testsToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
}

export default TestApprovedPage;

