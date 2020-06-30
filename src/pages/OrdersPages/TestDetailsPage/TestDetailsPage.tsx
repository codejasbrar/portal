import React, {useEffect, useState} from 'react';

//Styles
import styles from "../OrdersPages.module.scss";

//Components
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import {Link} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme from "../../../themes/CommonTableTheme";
import {ReactComponent as SortIcon} from "../../../icons/sort.svg";
import {Order} from "../../../interfaces/Order";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import {ordersState} from "../../../selectors/selectors";
import CommonPagination from "../../../components/Table/Navigation/CommonPagination";
import LabSlipApiService from "../../../services/LabSlipApiService";


const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

const columns = [
  {
    name: "panicValueBiomarkers",
    label: "Biomarker",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "result",
    label: "Result",
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
    name: "normalRange",
    label: "Normal range",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "unitsPerEm",
    label: "Unit",
    options: {
      filter: true,
      sort: false,
    }
  },
];

const options: MUIDataTableOptions = {
  filter: false,
  download: false,
  print: false,
  viewColumns: false,
  searchOpen: false,
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

} as MUIDataTableOptions;

const NoMatches = () => (
  <div className={styles.sorry}>
    <p className={styles.sorryText}>
      No results found
    </p>
  </div>
);

const reformatDate = (order: Order) => {
  const date = new Date(order.received);
  return {
    ...order,
    result: `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
  }
};

const TestDetailsPage = () => {
  let [width, setWidth] = useState(getWidth());
  const orders = useSelector(ordersState);
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(orders);

  useEffect(() => {
    (async () => {
      const response = await LabSlipApiService.getTestsByStatus('PENDING');
      const orders = response.data;
      if (orders && orders.length) {
        setData(orders.map((item: any) => {
          item.criteriaMet = item.criteriaMet ? "Yes" : 'No';
          return item;
        }));
      }

      setData(orders);
      setLoading(false);
    })();

    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);


  const ordersToView = data
    .map(reformatDate)
    // .sort(((a: any, b: any) => {
    //   const aDate = new Date(a.result);
    //   const bDate = new Date(b.result);
    //
    //   return aDate > bDate ? 1 : -1;
    // }));

  if (loading) {
    return <Spinner />;
  }

  return <>
    {loading && <Spinner />}
    <section className={`${styles.wrapper} ${styles.detailsWrapper}`}>
      <div className={styles.container}>
        <Link to={'/orders/navigation'} className={`${styles.menuLink} ${styles.menuLinkBack} ${styles.showTabletHorizontal}`}>
          Back <span className={styles.menuLinkBackMobile}>to physician portal</span>
        </Link>
        <div className={`${styles.containerFlex} ${styles.contentWrapper}`}>
          <section className={styles.adminSection}>
            <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Test result ID: 1234567890</h2>

            <aside className={styles.testInfo}>
              <p className={styles.testInfoString}>
                <span className={styles.testInfoBold}>Received: </span>
                4/23/2020 1:31PM
              </p>
              <p className={styles.testInfoString}>
                <span className={styles.testInfoBold}>Order ID: </span>
                34557445
              </p>
              <p className={styles.testInfoString}>
                <span className={styles.testInfoBold}>Customer ID: </span>
                33245
              </p>
              <p className={styles.testInfoString}>
                <span className={styles.testInfoBold}>Gender: </span>
                {/*{item.customerGender}*/}
              </p>
              <p className={styles.testInfoString}>
                <span className={styles.testInfoBold}>Age: </span>
                31
              </p>
              <button className={`${styles.btnPrimary} ${styles.testInfoBtn}`}>Approve results</button>
            </aside>

            <div className={styles.comment}>
              <label >
                <textarea className={styles.commentField} name="comment field" placeholder={'Add your comment here'}></textarea>
              </label>
              <div className={styles.commentBtnWrapper}>
                <button className={`${styles.btnPrimary} ${styles.commentBtn} `}>Add</button>
              </div>
            </div>

            <div className={styles.commentList}>
              <div className={styles.commentItem}>
                <h4 className={styles.commentItemAuthor}>Dr Edward Armstrong</h4>
                <span className={styles.commentItemDate}>4/23/2020 1:31PM</span>
                <p className={styles.commentItemText}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea consequat.
                </p>
              </div>
              <div className={styles.commentItem}>
                <h4 className={styles.commentItemAuthor}>Vicky Zhao-Silvestro</h4>
                <span className={styles.commentItemDate}>4/22/2020 9:12AM</span>
                <p className={styles.commentItemText}>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur nostrud incididunt exercitation.
                </p>
              </div>
            </div>

          </section>

          <section className={`${styles.orders} ${styles.resultsTable}`}>
            {width > 700 ?
              <MuiThemeProvider theme={CommonTableTheme()}>
                <MUIDataTable
                  title={''}
                  data={data.map(reformatDate)}
                  columns={columns}
                  options={options}
                />
              </MuiThemeProvider>
              :
              <div className={styles.mobileOrders}>
                <h2 className={`${styles.heading20} ${styles.mobileOrdersName}`}>Results</h2>
                {ordersToView
                  .map((item: any, i) => (
                    <div key={i} className={styles.mobileOrdersItem}>
                      <p className={styles.mobileOrdersTitle}>Biomarker:&nbsp;
                        <span className={styles.mobileOrdersText}>{item.panicValueBiomarkers}</span></p>
                      <p className={styles.mobileOrdersTitle}>Result:&nbsp;
                        <span className={styles.mobileOrdersText}>{item.result}</span>
                      </p>
                      <p className={styles.mobileOrdersTitle}>Normal range:&nbsp;
                        <span className={styles.mobileOrdersText}>{item.customerId}</span></p>
                      <p className={styles.mobileOrdersTitle}>Unit:&nbsp;
                        <span className={styles.mobileOrdersText}>{item.unitsPerEm}</span></p>
                    </div>
                  ))}
                {ordersToView.length === 0 && <NoMatches />}
              </div>
            }
          </section>

        </div>
      </div>
    </section>

  </>
}
export default TestDetailsPage;
