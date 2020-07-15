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
import {Test} from "../../../interfaces/Test";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import {useDispatch, useSelector} from "react-redux";
import {testsPendingState} from "../../../selectors/selectors";
import {loadTestsByStatus} from "../../../actions/testsActions";
import {Order} from "../../../interfaces/Order";
import {reformatDate} from "../ApprovedOrdersPage/ApprovedOrdersPage";

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
      sort: false,
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
    name: "panicValueBiomarkers",
    label: "Biomarkers out of range",
    options: {
      filter: true,
      sort: false,
    },
    customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
      return value.join(", ");
    }
  },
];

const options = (onSelect: any, onSaved: any, setPage: any, page: any) => ({
  filterType: 'checkbox',
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: true,
  search: false,
  responsive: "scrollFullHeight",
  rowsPerPage: 25,
  selectableRows: 'multiple',
  selectToolbarPlacement: 'above',
  rowsPerPageOptions: [25],
  rowHover: true,
  textLabels: {
    body: {
      noMatch: "No results found",
    }
  },
  onChangePage: (currentPage) => setPage(currentPage),
  onSearchChange: () => setPage(0),
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
  customToolbar: () => '',
  customToolbarSelect: (selected, displayData, setSelectedRows) => {
    const displayedRows = displayData.slice(page*25, page*25+25);
    const displayedSelectedRows = selected.data
      .filter((item: any) => displayedRows.find((currentItem) => currentItem.dataIndex === item.dataIndex));

    if (displayedSelectedRows.length == 0) {
      setSelectedRows([]);
    }
    return <ApproveButton mode="result"
      text={"Approve results"}
      onSaved={onSaved}
      selected={onSelect(displayedSelectedRows)} />
  },
  customSearchRender: SearchBar,
} as MUIDataTableOptions);

const NoMatches = () => (
  <div className={styles.sorry}>
    <p className={styles.sorryText}>
      No results found
    </p>
  </div>
);

const TestsPage = () => {
  const [data, setData] = useState([] as Test[]);
  const [searchText, setSearchText] = useState('');
  const [page, setPage] = useState(0);
  const [width, setWidth] = useState(getWidth());
  const dispatch = useDispatch();
  const tests = useSelector(testsPendingState);

  useEffect(() => {
    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  const onSaved = async () => {
    await Promise.all([dispatch(loadTestsByStatus('PENDING', 0)), dispatch(loadTestsByStatus("APPROVED", 0))]);
  };

  useEffect(() => {
    onLoad();
  }, [tests]);

  const onLoad = () => {
    if (tests && tests.length) {
      setData(tests.map((item: any) => {
        item.criteriaMet = item.criteriaMet ? "Yes" : 'No';
        return item;
      }));
    }
  };

  const searchFilter = (item: any) =>
    (String(item.id).indexOf(searchText) !== -1)
    || (String(item.customerId).indexOf(searchText) !== -1)
      ? 1 : 0;

  const testsToView = data
    .map(reformatDate)
    .filter(searchFilter);

  const onClickLink = (id: number) => tests.filter(test => test.id === id)[0];

  const onSelect = (selectedRows: { index: number, dataIndex: number }[]) => selectedRows.map(row => data[row.index]);

  return <section className={styles.tests}>
    <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.showTabletHorizontal}`}>
      Main menu
    </Link>
    <h2 className={styles.heading20}>Test results pending approval</h2>
    {width > 700 ?
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          title={''}
          data={data.map(reformatDate)}
          columns={columns(onClickLink)}
          options={options(onSelect, onSaved, setPage, page)}
        />
      </MuiThemeProvider>
      :
      <div className={styles.mobileTests}>
        <p className={styles.testsResultsInfo}>({testsToView.length} results)</p>
        <ApproveButton mode="result" onSaved={onSaved} selected={data as Order[]} text={"Approve all results"} />
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {testsToView
          .map((item: any, i) => (
            <div key={i} className={styles.mobileTestsItem}>
              <p className={styles.mobileTestsTitle}>Test result
                ID: <span className={styles.mobileTestsText}> <Link className={styles.mobileTestsLink}
                  to={`/orders/test/${item.hash}`}
                >{item.id}</Link></span></p>
              <p className={styles.mobileTestsTitle}>Received: <span className={styles.mobileTestsText}>{item.received}</span>
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
                onSaved={onSaved}
                selected={[item]}
                text={"Approve"} />
            </div>
          ))}
        {testsToView.length === 0 && <NoMatches />}
      </div>
    }
  </section>
}

export default TestsPage;
