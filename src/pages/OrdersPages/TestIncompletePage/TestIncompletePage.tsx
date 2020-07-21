import React, {useEffect, useState} from 'react';
import styles from "../OrdersPages.module.scss";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableOptions} from "mui-datatables";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import {useDispatch, useSelector} from "react-redux";
import {testsIncompleteState} from "../../../selectors/selectors";
import {loadTestsByStatus} from "../../../actions/testsActions";
import {Order, OrdersResponse} from "../../../interfaces/Order";
import {reformatDate, useResizeListener} from "../PendingOrdersPage/PendingOrdersPage";
import Spinner from "../../../components/Spinner/Spinner";
import Pagination from "../../../components/Table/Pagination/Pagination";
import {itemsToView, NoMatches} from "../PendingOrdersPage/PendingOrdersPage";
import {testsNotApprovedColumns} from "../TestPendingOrdersPage/TestPendingOrdersPage";

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
  customFooter: (rowCount) => setCount(rowCount),
  customToolbarSelect: (selected) => <ApproveButton type="pending" mode="result"
    text={"Approve results"}
    onSaved={onSaved}
    selected={onSelect(selected.data)} />,
  customSearchRender: SearchBar,
  customToolbar: () => ''
} as MUIDataTableOptions);

const TestIncompletePage = () => {
  const [data, setData] = useState({} as OrdersResponse);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const width = useResizeListener();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [searchItemsCount, setCount] = useState(0);
  const tests = useSelector(testsIncompleteState);

  useEffect(() => {
    if (tests.content && tests.content.length) {
      setData({
        ...tests, content: tests.content.map((item: Order) => {
          item.criteriaMet = item.criteriaMet ? "Yes" : 'No';
          return item;
        })
      })
    }
  }, [tests]);

  useEffect(() => {
    if (tests.content && tests.content.length) onSaved();
  }, [page]);

  useEffect(() => {
    onSaved();
  }, []);

  const onSaved = async () => {
    setLoading(true);
    await dispatch(loadTestsByStatus('INCOMPLETE', page));
    setLoading(false);
  };

  const testsToView = itemsToView(data, searchText);

  const onClickLink = (id: number) => tests.content.filter(test => test.id === id)[0];

  const onSelect = (selectedRows: { index: number, dataIndex: number }[]) => selectedRows.map(row => data.content[row.index]);

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
          data={data.content ? data.content.map(reformatDate) : []}
          columns={testsNotApprovedColumns(onClickLink)}
          options={options(onSelect, onSaved, setCount)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={data.totalPages}
          itemsPerPage={data.size}
          searchItems={searchItemsCount}
          totalItems={data.totalElements} />
      </MuiThemeProvider>
      :
      <div className={styles.mobileTests}>
        <p className={styles.testsResultsInfo}>({data.totalElements || 0} results)</p>
        <ApproveButton type="pending"
          mode="result"
          onSaved={onSaved}
          selected={data.content}
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
          totalPages={data.totalPages}
          itemsPerPage={data.size}
          searchItems={testsToView.length}
          totalItems={data.totalElements} />
        {testsToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
};

export default TestIncompletePage;
