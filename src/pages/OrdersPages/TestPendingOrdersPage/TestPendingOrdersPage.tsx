import React, {useEffect, useState} from 'react';
import styles from "../OrdersPages.module.scss";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import {ReactComponent as SortIcon} from "../../../icons/sort.svg";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import {Test} from "../../../interfaces/Test";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import {useDispatch, useSelector} from "react-redux";
import {isAdmin, testsPendingState} from "../../../selectors/selectors";
import {loadTestsByStatus} from "../../../actions/testsActions";
import {
  customDateColumnRender,
  NoMatches,
  reformatDate, useData,
  useResizeListener,
} from "../PendingOrdersPage/PendingOrdersPage";
import Pagination from "../../../components/Table/Pagination/Pagination";
import Spinner from "../../../components/Spinner/Spinner";
import {itemsToView} from "../PendingOrdersPage/PendingOrdersPage";
import {SortDirection} from "../../../services/LabSlipApiService";
import {ReactComponent as DangerIcon} from "../../../icons/danger.svg";

export const testsNotApprovedColumns = (onClickLink: (id: number) => Test, onSort: (sortParam: string) => void) => [
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
        return link ? <Link to={`/orders/test/${link.hash}`} color="secondary">{value}</Link> : ''
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
    name: "panicValueBiomarkers",
    label: "Biomarkers out of range",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
        const markers = value;
        if (!markers) {
          return <div className={styles.markersWrapper} />;
        }
        const renderedMarkers = markers.map((marker: string) => <><DangerIcon className={styles.dangerIconLeft}/>{marker}; </>);
        return <div className={styles.markersWrapper}>{renderedMarkers}</div>;
      }
    },
  }
];

const options = (onSelect: any, onSaved: any, setCount: (count: number) => void, isAdmin: boolean) => ({
  filterType: 'checkbox',
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  rowsPerPage: 25,
  selectableRows: isAdmin ? 'none' : 'multiple',
  selectToolbarPlacement: 'above',
  rowsPerPageOptions: [25],
  rowHover: true,
  textLabels: {
    body: {
      noMatch: "No results found",
    }
  },
  customFooter: (rowCount) => setCount(rowCount),
  customToolbar: () => '',
  customToolbarSelect: (selected, displayData, setSelectedRows) => {
    return <ApproveButton mode="result"
      text={"Approve results"}
      onSaved={onSaved}
      selected={onSelect(selected.data)} />
  },
  customSearchRender: SearchBar,
} as MUIDataTableOptions);

const TestsPage = () => {
  const admin = useSelector(isAdmin);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const width = useResizeListener();
  const [loading, setLoading] = useState(true);
  const [searchItemsCount, setCount] = useState(0);
  const [sort, setSort] = useState({param: 'received', direction: 'desc' as SortDirection});
  const dispatch = useDispatch();
  const tests = useData(testsPendingState);

  useEffect(() => {
    onSaved();
  }, []);

  const onSaved = async () => {
    setLoading(true);
    await dispatch(loadTestsByStatus('PENDING', page, sort.param, sort.direction));
    setLoading(false);
  };


  useEffect(() => {
    if (tests.content && tests.content.length) onSaved();
  }, [page, sort]);

  const onSort = (sortParam: string = 'received') => {
    setSort({
      param: sortParam,
      direction: sortParam === sort.param ? sort.direction === 'desc' ? 'asc' : 'desc' : 'desc'
    });
    setPage(0);
  };

  const testsToView = itemsToView(tests, searchText);

  const onClickLink = (id: number) => tests.content.filter(test => test.id === id)[0];

  const onSelect = (selectedRows: { index: number, dataIndex: number }[]) => selectedRows.map(row => tests.content[row.index]);

  return <section className={styles.tests}>
    {loading && <Spinner />}
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Pending approval test results</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={tests.content ? tests.content.map(reformatDate) : []}
          columns={testsNotApprovedColumns(onClickLink, onSort)}
          options={options(onSelect, onSaved, setCount, admin)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={tests.totalPages}
          itemsPerPage={tests.size}
          searchItems={searchItemsCount}
          totalItems={tests.totalElements} />
      </MuiThemeProvider>
      :
      <div className={styles.mobileTests}>
        <p className={styles.testsResultsInfo}>({tests.totalElements || 0} results)</p>
        {!admin &&
        <ApproveButton mode="result" onSaved={onSaved} selected={tests.content} text={"Approve all results"} />}
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {testsToView
          .map((item: any, i) => (
            <div key={i} className={styles.mobileTestsItem}>
              <p className={styles.mobileTestsTitle}>Test result
                ID: <span className={styles.mobileTestsText}> <Link className={styles.mobileTestsLink}
                  to={`/orders/test/${item.hash}`}
                >{item.id}</Link></span></p>
              <p className={styles.mobileTestsTitle}>Received: <span className={styles.mobileTestsText}>{item.received.replace('T', ' ')}</span>
              </p>
              <p className={styles.mobileTestsTitle}>Order
                ID: <span className={styles.mobileTestsText}>{item.orderId}</span></p>
              <p className={styles.mobileTestsTitle}>Customer
                ID: <span className={styles.mobileTestsText}>{item.customerId}</span></p>
              <p className={styles.mobileTestsTitle}>Biomarkers out of
                range: <span className={styles.mobileTestsText}>
                  {item.panicValueBiomarkers && item.panicValueBiomarkers.length ?
                    <div className={styles.markersWrapper}> {item.panicValueBiomarkers.map((item: any)=><><DangerIcon className={styles.dangerIconLeft}/>{item}; </>)} </div>
                    : "None"}
              </span>
              </p>
              {!admin && <ApproveButton className={styles.btnApproveMobile}
                mode="result"
                onSaved={onSaved}
                selected={[item]}
                text={"Approve"} />}
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

export default TestsPage;
