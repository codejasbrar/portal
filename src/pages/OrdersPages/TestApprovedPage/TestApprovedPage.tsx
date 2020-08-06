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
import {
  customDateColumnRender,
  NoMatches,
  reformatDate, useData,
  useResizeListener
} from "../PendingOrdersPage/PendingOrdersPage";
import {Test} from "../../../interfaces/Test";
import {OrdersResponse} from "../../../interfaces/Order";
import {loadTestsByStatus} from "../../../actions/testsActions";
import Pagination from "../../../components/Table/Pagination/Pagination";
import Spinner from "../../../components/Spinner/Spinner";
import {itemsToView} from "../PendingOrdersPage/PendingOrdersPage";
import {SortDirection} from "../../../services/LabSlipApiService";


const columns = (onClickLink: (id: number) => Test, onSort: (sortParam: string) => void) => [
  {
    name: "id",
    label: "Test result ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) =>
        <td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => onSort('id')}>{columnMeta.label}<span><SortIcon /></span></button>
        </td>,
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
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) =>
        <td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => onSort('received')}>{columnMeta.label}<span><SortIcon /></span></button>
        </td>,
      customBodyRender: customDateColumnRender
    }
  },
  {
    name: "orderId",
    label: "Order ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) =>
        <td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => onSort('orderId')}>{columnMeta.label}<span><SortIcon /></span></button>
        </td>,
    }
  },
  {
    name: "customerId",
    label: "Customer ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) =>
        <td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => onSort('customerId')}>{columnMeta.label}<span><SortIcon /></span></button>
        </td>,
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
  customFooter: (rowCount) => onSearch(rowCount),
  customToolbarSelect: () => <></>,
  customSearchRender: SearchBar,
  customToolbar: () => <></>,
} as MUIDataTableOptions);

const TestApprovedPage = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const width = useResizeListener();
  const tests = useData(testsApprovedState);
  const [searchItemsCount, setCount] = useState(0);
  const [sort, setSort] = useState({param: 'received', direction: 'desc' as SortDirection});
  const [page, setPage] = useState(0);

  const onSaved = async () => {
    setLoading(true);
    await dispatch(loadTestsByStatus('APPROVED', page, sort.param, sort.direction));
    setLoading(false);
  };

  useEffect(() => {
    if (tests && tests.content && tests.content.length) onSaved();
  }, [page, sort]);

  useEffect(() => {
    onSaved();
  }, []);

  const onSort = (sortParam: string = 'received') => {
    setSort({
      param: sortParam,
      direction: sortParam === sort.param ? sort.direction === 'desc' ? 'asc' : 'desc' : 'desc'
    });
    setPage(0);
  };

  const testsToView = itemsToView(tests, searchText);

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
          data={tests.content ? tests.content.map(reformatDate) : []}
          columns={columns(onClickLink, onSort)}
          options={options(setCount)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={tests.totalPages}
          itemsPerPage={tests.size}
          searchItems={searchItemsCount}
          totalItems={tests.totalElements} />
      </MuiThemeProvider>
      :
      <div className={styles.mobileOrders}>
        <p className={styles.testsResultsInfo}>({tests.totalElements || 0} results)</p>
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {testsToView
          .map((item: any, i) => (
            <div key={i} className={styles.mobileOrdersItem}>
              <p className={styles.mobileOrdersTitle}>Test result ID: <span className={styles.mobileOrdersText}><Link className={styles.mobileTestsLink}
                  to={`/orders/test/${item.hash}`}
                >{item.id}</Link></span></p>
              <p className={styles.mobileOrdersTitle}>Received: <span className={styles.mobileOrdersText}>{item.received.replace('T', ' ')}</span>
              </p>
              <p className={styles.mobileOrdersTitle}>Order ID: <span className={styles.mobileOrdersText}>{item.orderId}</span>
              </p>
              <p className={styles.mobileOrdersTitle}>Customer
                ID: <span className={styles.mobileOrdersText}>{item.customerId}</span></p>
              <p className={styles.mobileOrdersTitle}>Criteria
                met: <span className={styles.mobileOrdersText}>{item.criteriaMet ? "Yes" : "No"}</span></p>
              <p className={styles.mobileOrdersTitle}>Approved: <span className={styles.mobileOrdersText}>{item.approved.replace('T', ' ')}</span>
              </p>
            </div>
          ))}
        <Pagination mobile
          page={page}
          setPage={setPage}
          totalPages={tests.totalPages}
          itemsPerPage={tests.size}
          searchItems={testsToView.length}
          totalItems={tests.totalElements} />
        {testsToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
}

export default TestApprovedPage;

