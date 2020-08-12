import React from 'react';
import styles from "../OrdersPages.module.scss";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableOptions} from "mui-datatables";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import {testsIncompleteState} from "../../../selectors/selectors";
import {usePageState, useResizeListener, NoMatches} from "../PendingOrdersPage/PendingOrdersPage";
import Spinner from "../../../components/Spinner/Spinner";
import Pagination from "../../../components/Table/Pagination/Pagination";
import {testsNotApprovedColumns} from "../TestPendingOrdersPage/TestPendingOrdersPage";
import {Order} from "../../../interfaces/Order";
import {useCounters} from "../../../components/Navigation/Navigation";

const options = (onSelect: any, onSaved: any, searchText: string, setSearchText: (searchText: string) => void) => ({
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
  customToolbarSelect: (selected, data, setSelectedRows) => {
    let selectedItems;
    try {
      selectedItems = onSelect(selected.data);
      selectedItems.map((item: Order) => item.id);
    } catch (e) {
      setSelectedRows([]);
    }
    return <ApproveButton type="pending" mode="result"
      text={"Approve results"}
      onSaved={onSaved}
      selected={selectedItems} />
  },
  customSearchRender: () => SearchBar(searchText, setSearchText, false, undefined),
  customToolbar: () => '',
  customFooter: () => <></>,
} as MUIDataTableOptions);


const TestIncompletePage = () => {
  const width = useResizeListener();
  const [loading, tests, page, sort, onSort, setPage, searchText, setSearchText, onSaved] = usePageState('test', 'INCOMPLETE', testsIncompleteState);

  const testsToView = tests.content || [];

  const count = useCounters().incompleteResults;

  const onClickLink = (id: number) => tests.content.filter((test: Order) => test.id === id)[0];

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
          data={tests.content || []}
          columns={testsNotApprovedColumns(onClickLink, sort.param, onSort)}
          options={options(onSelect, onSaved, searchText, setSearchText)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={tests.totalPages}
          itemsPerPage={tests.size}
          searchItems={testsToView.length}
          totalItems={tests.totalElements} />
      </MuiThemeProvider>
      :
      <div className={styles.mobileTests}>
        <p className={styles.testsResultsInfo}>({count || 0} results)</p>
        <ApproveButton type="pending"
          mode="result"
          onSaved={onSaved}
          selected={tests.content}
          text={"Approve all results"} />
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {testsToView
          .map((item: any, i: number) => (
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
