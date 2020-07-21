import React, {useEffect, useState} from 'react';
import styles from "../OrdersPages.module.scss";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import {ReactComponent as SortIcon} from "../../../icons/sort.svg";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import {useDispatch, useSelector} from "react-redux";
import {testsApprovedState} from "../../../selectors/selectors";
import {NoMatches, reformatDate, useResizeListener} from "../PendingOrdersPage/PendingOrdersPage";
import {Test} from "../../../interfaces/Test";
import {OrdersResponse} from "../../../interfaces/Order";
import {loadTestsByStatus} from "../../../actions/testsActions";
import Pagination from "../../../components/Table/Pagination/Pagination";
import Spinner from "../../../components/Spinner/Spinner";
import {itemsToView} from "../PendingOrdersPage/PendingOrdersPage";


const columns = (onClickLink: (id: number) => Test) => [
  {
    name: "id",
    label: "Test result ID",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
        const link = onClickLink(value);
        return link && <Link
          to={`/orders/test/${link.hash}`} /*need page refresh*/
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
  customFooter: (rowCount) => onSearch(rowCount),
  customToolbarSelect: () => <></>,
  customSearchRender: SearchBar,
  customToolbar: () => <></>,
} as MUIDataTableOptions);

const TestApprovedPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({} as OrdersResponse);
  const [searchText, setSearchText] = useState('');
  const width = useResizeListener();
  const tests = useSelector(testsApprovedState);
  const [searchItemsCount, setCount] = useState(0);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (tests && tests.content && tests.content.length) setData(tests);
  }, [tests]);

  const onSaved = async () => {
    setLoading(true);
    await dispatch(loadTestsByStatus('APPROVED', page));
    setLoading(false);
  };

  useEffect(() => {
    if (tests && tests.content && tests.content.length) onSaved();
  }, [page]);

  useEffect(() => {
    onSaved();
  }, []);

  const testsToView = itemsToView(data, searchText);

  const onClickLink = (id: number) => tests.content.filter(test => test.id === id)[0];

  return <section className={styles.tests}>
    {loading && <Spinner />}
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Approved test results</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={data.content ? data.content.map(reformatDate) : []}
          columns={columns(onClickLink)}
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
        <p className={styles.testsResultsInfo}>({data.totalElements || 0} results)</p>
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {testsToView
          .map((item: any, i) => (
            <div key={i} className={styles.mobileOrdersItem}>
              <p className={styles.mobileOrdersTitle}>Test result ID: <span className={styles.mobileOrdersText}><Link className={styles.mobileTestsLink}
                  to={`/orders/test/${item.hash}`}
                >{item.id}</Link></span></p>
              <p className={styles.mobileOrdersTitle}>Received: <span className={styles.mobileOrdersText}>{item.received}</span>
              </p>
              <p className={styles.mobileOrdersTitle}>Order ID: <span className={styles.mobileOrdersText}>{item.orderId}</span>
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
          searchItems={testsToView.length}
          totalItems={data.totalElements} />
        {testsToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
}

export default TestApprovedPage;

