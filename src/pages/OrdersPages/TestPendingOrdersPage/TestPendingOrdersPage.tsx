import React from 'react';
import styles from "../OrdersPages.module.scss";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import SearchBar from "../../../components/Table/Search/SearchBar";
import SearchBarMobile from "../../../components/Table/SearchMobile/SearchBarMobile";
import {Test} from "../../../interfaces/Test";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import {useSelector} from "react-redux";
import {isAdmin, resultsQuantity, testsPendingState} from "../../../selectors/selectors";
import {
  customDateColumnRender, customHeadSortRender,
  NoMatches, tableBaseOptions,
} from "../PendingOrdersPage/PendingOrdersPage";
import Pagination from "../../../components/Table/Pagination/Pagination";
import Spinner from "../../../components/Spinner/Spinner";
import {ReactComponent as DangerIcon} from "../../../icons/danger.svg";
import {ReactComponent as CommentIcon} from "../../../icons/comment.svg";
import {Order} from "../../../interfaces/Order";
import useResizeListener from "../../../hooks/useResizeListener";
import usePageState from "../../../hooks/usePageState";

export const testsNotApprovedColumns = (onClickLink: (id: number) => Test, sortParam: string, onSort: (sortParam: string) => void) => [
  {
    name: "id",
    label: "Test result ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
      customBodyRender: (value: any) => {
        const link = onClickLink(value);
        return link ? <Link to={`/orders/test/${link.hash}`} color="secondary">{value}</Link> : ''
      }
    }
  },
  {
    name: "observed",
    label: "Collected",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
      customBodyRender: customDateColumnRender
    }
  },
  {
    name: "received",
    label: "Received",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
      customBodyRender: customDateColumnRender
    }
  },
  {
    name: "orderId",
    label: "Order ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
    }
  },
  {
    name: "customerId",
    label: "Customer ID",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer) => customHeadSortRender(columnMeta, sortParam, onSort),
    }
  },
  {
    name: "panicValueBiomarkers",
    label: "Biomarkers out of range",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: string[]) => {
        const markers = value;
        if (!markers) {
          return " ";
        }
        return markers.map((marker: string, idx: number) => <span className={styles.panicValueName} key={marker + idx}>
          <DangerIcon title={`${marker} have panic value`}
            className={styles.dangerIconLeft} />&nbsp;{marker}{idx === markers.length - 1 ? "" : ";"} </span>);
      }
    },
  },
  {
    name: "commentsExist",
    label: " ",
    options: {
      filter: false,
      sort: false,
      customBodyRender: (value: boolean) => value && <CommentIcon title="This test result has comments" />
    }
  }
];

const options = (onSelect: any, onSaved: any, isAdmin: boolean, searchText: string, setSearchText: (searchText: string) => void) => ({
  ...tableBaseOptions,
  selectableRows: isAdmin ? 'none' : 'multiple',
  customToolbarSelect: (selected, data, setSelectedRows) => {
    const selectedItems = onSelect(selected.data);
    try {
      selectedItems.map((item: Order) => item.id);
    } catch (e) {
      setSelectedRows([]);
      return <></>;
    }
    return <ApproveButton type="approved" mode="result"
      text={"Approve results"}
      onSaved={onSaved}
      onSelected={setSelectedRows}
      selected={selectedItems} />
  },
  customSearchRender: () => SearchBar(searchText, setSearchText, false, undefined),
} as MUIDataTableOptions);

const TestsPage = () => {
  const admin = useSelector(isAdmin);
  const width = useResizeListener();
  const [loading, tests, page, sort, onSort, setPage, searchText, setSearchText, onSaved] = usePageState('test', 'PENDING', testsPendingState);
  const count = useSelector(resultsQuantity).pendingResults;
  const testsToView = tests.content || [];

  const havePanic = !!testsToView.filter((test: Order) => !!test.panicValueBiomarkers?.length).length;

  const onClickLink = (id: number) => tests.content.filter((test: Order) => test.id === id)[0];

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
          data={testsToView}
          columns={testsNotApprovedColumns(onClickLink, sort.param, onSort)}
          options={options(onSelect, onSaved, admin, searchText, setSearchText)}
        />
        <Pagination page={page}
          setPage={setPage}
          totalPages={tests.totalPages}
          itemsPerPage={tests.size}
          searchItems={testsToView.length}
          totalItems={tests.totalElements}
          legend={havePanic}
        />
      </MuiThemeProvider>
      :
      <div className={styles.mobileTests}>
        <p className={styles.testsResultsInfo}>({count || 0} results)</p>
        {!admin &&
        <ApproveButton mode="result" onSaved={onSaved} selected={tests.content} text={"Approve all results"} mobile />}
        <SearchBarMobile value={searchText} onChange={setSearchText} />
        {havePanic && <div className={styles.legend}>
          <DangerIcon className={styles.dangerIconLeft} /> Results with panic value
        </div>}
        {testsToView
          .map((item: Order, i: number) => (
            <div key={i} className={styles.mobileTestsItem}>
              {item.commentsExist && <CommentIcon className={styles.mobileTestsComments} />}
              <p className={styles.mobileTestsTitle}>Test result
                ID: <span className={styles.mobileTestsText}> <Link className={styles.mobileTestsLink}
                  to={`/orders/test/${item.hash}`}
                >{item.id}</Link></span></p>
              <p className={styles.mobileTestsTitle}>Collected: <span className={styles.mobileTestsText}>{item.observed.replace('T', ' ')}</span>
              </p>
              <p className={styles.mobileTestsTitle}>Received: <span className={styles.mobileTestsText}>{item.received.replace('T', ' ')}</span>
              </p>
              <p className={styles.mobileTestsTitle}>Order
                ID: <span className={styles.mobileTestsText}>{item.orderId}</span></p>
              <p className={styles.mobileTestsTitle}>Customer
                ID: <span className={styles.mobileTestsText}>{item.customerId}</span></p>
              <p className={styles.mobileTestsTitle}>Biomarkers out of
                range: <span className={styles.mobileTestsText}>
                  {item.panicValueBiomarkers && item.panicValueBiomarkers.length ?
                    <span className={styles.markersWrapper}> {item.panicValueBiomarkers.map((item: string) => <span
                      className={styles.markersItem}><DangerIcon
                      className={styles.dangerIconLeft} />{item};</span>)} </span>
                    : "None"}
              </span>
              </p>
              {!admin && <ApproveButton className={styles.btnApproveMobile}
                mode="result"
                onSaved={onSaved}
                selected={[item]}
                text={"Approve"}
                mobile
              />}
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
