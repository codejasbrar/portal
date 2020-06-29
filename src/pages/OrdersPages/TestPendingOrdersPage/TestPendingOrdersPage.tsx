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
import LabSlipApiService from "../../../services/LabSlipApiService";
import Spinner from "../../../components/Spinner/Spinner";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";

const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

const columns = [
  {
    name: "id",
    label: "Test result ID",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: any, tableMeta: any, updateValue: any) => (
        <Link
          to={`${value}`}
          // to={"/orders/test-details/"} /*need page refresh*/
          color="secondary"
        >{value}</Link>
      )
    }
  },
  {
    name: "received",
    label: "Received",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer, updateDirection: (params: any) => any) =>
        <td style={{borderBottom: "1px solid #C3C8CD"}}>
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

const options = (onSelect: any, onSaved: any) => ({
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
  customToolbarSelect: (selected) => <ApproveButton mode="result"
    text={"Approve results"}
    onSaved={onSaved}
    selected={onSelect(selected.data)} />,
  customSearchRender: SearchBar,
  customToolbar: () => ''
} as MUIDataTableOptions);

const NoMatches = () => (
  <div className={styles.sorry}>
    <p className={styles.sorryText}>
      No results found
    </p>
  </div>
);

const reformatDate = (test: Test) => {
  const date = new Date(test.received);
  return {
    ...test,
    received: `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  }
};

const TestsPage = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  let [width, setWidth] = useState(getWidth());

  useEffect(() => {
    onSaved().then(() => {
      setLoading(false);
    });


    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  const onSaved = async () => {
    const response = await LabSlipApiService.getOrdersByStatus('PENDING');
    const orders = response.data;
    if (orders && orders.length) {
      setData(orders.map((item: any) => {
        item.criteriaMet = item.criteriaMet ? "Yes" : 'No';
        return item;
      }));
    }

    setData(orders);
  };

  const searchFilter = (item: any) =>
    (String(item.id).indexOf(searchText) !== -1)
    || (String(item.customerId).indexOf(searchText) !== -1)
      ? 1 : 0;

  const testsToView = data
    .map(reformatDate)
    .filter(searchFilter)
  // .sort(((a: any, b: any) => {
  //   const aDate = new Date(a.received);
  //   const bDate = new Date(b.received);
  //
  //   return aDate > bDate ? 1 : -1;
  // }));

  const onSelect = (selectedRows: { index: number, dataIndex: number }[]) => selectedRows.map(row => data[row.index]);

  if (loading) {
    return <Spinner />;
  }

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
          columns={columns}
          options={options(onSelect, onSaved)}
        />
      </MuiThemeProvider>
      :
      <div className={styles.mobileTests}>
        <p className={styles.testsResultsInfo}>({testsToView.length} results)</p>
        <ApproveButton mode="result" onSaved={onSaved} selected={data} text={"Approve all results"} />
        <SearchBarMobile onChange={(e: any) => setSearchText(e.target.value)} />
        {testsToView
          .map((item: any, i) => (
            <div key={i} className={styles.mobileTestsItem}>
              <p className={styles.mobileTestsTitle}>Test result
                ID: <span className={styles.mobileTestsText}> <Link className={styles.mobileTestsLink}
                  to={`/test/${item.id}`}>{item.id}</Link></span></p>
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
