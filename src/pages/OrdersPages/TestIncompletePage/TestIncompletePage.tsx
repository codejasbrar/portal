import React, {useEffect, useState} from 'react';
import styles from "../OrdersPages.module.scss";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableOptions} from "mui-datatables";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import {useDispatch} from "react-redux";
import {testsIncompleteState} from "../../../selectors/selectors";
import {loadTestsByStatus} from "../../../actions/testsActions";
import {reformatDate, useData, useResizeListener} from "../PendingOrdersPage/PendingOrdersPage";
import Spinner from "../../../components/Spinner/Spinner";
import Pagination from "../../../components/Table/Pagination/Pagination";
import {itemsToView, NoMatches} from "../PendingOrdersPage/PendingOrdersPage";
import {testsNotApprovedColumns} from "../TestPendingOrdersPage/TestPendingOrdersPage";
import {SortDirection} from "../../../services/LabSlipApiService";

const options = (onSelect: any, onSaved: any, setCount: (count: number) => void) => ({
  filterType: 'checkbox',
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  rowsPerPage: 25,
  selectToolbarPlacement: 'above',
  rowsPerPageOptions: [25],
  rowHover: true,
  textLabels: {
    body: {
      noMatch: "No results found",
    }
  },
  customFooter: (rowCount) => setCount(rowCount),
  customToolbarSelect: (selected) => <ApproveButton type="pending" mode="result"
    text={"Approve results"}
    onSaved={onSaved}
    selected={onSelect(selected.data)} />,
  customSearchRender: SearchBar,
  customToolbar: () => ''
} as MUIDataTableOptions);


const TestIncompletePage = () => {
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const width = useResizeListener();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchItemsCount, setCount] = useState(0);
  const [sort, setSort] = useState({param: 'received', direction: 'desc' as SortDirection});
  const tests = useData(testsIncompleteState);


  useEffect(() => {
    if (tests.content && tests.content.length) onSaved();
  }, [page, sort]);

  useEffect(() => {
    onSaved();
  }, []);

  const onSaved = async () => {
    setLoading(true);
    await dispatch(loadTestsByStatus('INCOMPLETE', page, sort.param, sort.direction));
    setLoading(false);
  };

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
    <h2 className={styles.heading20}>Incomplete test results</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={tests.content ? tests.content.map(reformatDate) : []}
          columns={testsNotApprovedColumns(onClickLink, onSort)}
          options={options(onSelect, onSaved, setCount)}
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
        <ApproveButton type="pending"
          mode="result"
          onSaved={onSaved}
          selected={tests.content}
          text={"Approve all results"} />
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {testsToView
          .map((item: any, i) => (
            <div key={i} className={styles.mobileTestsItem}>
              <p className={styles.mobileTestsTitle}>Test result
                ID: <span className={styles.mobileTestsText}> <Link className={styles.mobileTestsLink}
                  to={`/orders/test/${item.hash}`}>{item.id}</Link></span></p>
              <p className={styles.mobileTestsTitle}>Received: <span className={styles.mobileTestsText}>{item.received.replace('T', ' ')}</span>
              </p>
              <p className={styles.mobileTestsTitle}>Order
                ID: <span className={styles.mobileTestsText}>{item.orderId}</span></p>
              <p className={styles.mobileTestsTitle}>Customer
                ID: <span className={styles.mobileTestsText}>{item.customerId}</span></p>
              <p className={styles.mobileTestsTitle}>Biomarkers out of
                range: <span className={styles.mobileTestsText}>{item.panicValueBiomarkers && item.panicValueBiomarkers.length ? item.panicValueBiomarkers.join(", ") : "None"}</span>
              </p>
              <ApproveButton className={styles.btnApproveMobile}
                mode="result"
                type="pending"
                onSaved={onSaved}
                selected={[item]}
                text={"Approve"} />
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
};

export default TestIncompletePage;
