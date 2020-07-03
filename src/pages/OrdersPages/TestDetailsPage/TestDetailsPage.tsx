import React, {useEffect, useState} from 'react';

//Styles
import styles from "../OrdersPages.module.scss";

//Components
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import {Link, useParams} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import CommonTableTheme, {detailsTableTheme} from "../../../themes/CommonTableTheme";
import {ReactComponent as SortIcon} from "../../../icons/sort.svg";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import {testDetails} from "../../../selectors/selectors";
import {getResult} from "../../../actions/testsActions";
import {reformatDate} from "../ApprovedOrdersPage/ApprovedOrdersPage";
import {Biomarker, TestDetails} from "../../../interfaces/Test";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";


const getWidth = () => window.innerWidth
  || document.documentElement.clientWidth
  || document.body.clientWidth;

const columns = [
  {
    name: "name",
    label: "Biomarker",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    name: "value",
    label: "Result",
    options: {
      filter: true,
      sort: true,
      customBodyRender: (value: any, tableMeta: any) => {
        const markersRange = tableMeta.rowData[2] === "N/A" ? null : tableMeta.rowData[2].split(' - ');
        // const panic = value < parseInt(markersRange[0]) || value > parseInt(markersRange[1]);
        const panic = markersRange ? value < parseInt(markersRange[0]) || value > parseInt(markersRange[1]) : false;
        return <span className={styles.dotWrapper}>{value}{panic && <span className={styles.dot} />}</span>;
      },
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer, updateDirection: (params: any) => any) =>
        (<td key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => updateDirection(0)}>{columnMeta.label}<span><SortIcon /></span></button>
        </td>),
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
    name: "units",
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
  pagination: false,
  print: false,
  viewColumns: false,
  searchOpen: false,
  search: false,
  responsive: "scrollFullHeight",
  rowsPerPage: 45,
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

} as MUIDataTableOptions;

const TestDetailsPage = () => {
  let [width, setWidth] = useState(getWidth());
  const [loading, setLoading] = useState(true);
  const {hash} = useParams();
  const testSelected = useSelector(testDetails);
  const [test, setTest] = useState({} as TestDetails);
  const dispatch = useDispatch();

  useEffect(() => {
    if (testSelected) setTest(reformatDate(testSelected) as TestDetails);
  }, [testSelected]);


  const loadTest = async () => {
    setLoading(true);
    await dispatch(getResult(hash));
    setLoading(false);
  };


  useEffect(() => {
    loadTest();

    const resizeListener = () => {
      setWidth(getWidth())
    };
    window.addEventListener('resize', resizeListener);
    return () => {
      window.removeEventListener('resize', resizeListener);
    }
  }, []);

  // const biomarkerFormat = (biomarker: Biomarker) => ({...biomarker, normalRange: '10-60'});
  const biomarkerFormat = (biomarker: Biomarker) => ({...biomarker, normalRange: biomarker.maxPanicValue && biomarker.minPanicValue ? `${biomarker.minPanicValue} - ${biomarker.maxPanicValue}` : 'N/A'});

  return <>
    {loading && <Spinner />}
    <section className={`${styles.wrapper} ${styles.detailsWrapper}`}>
        <div className={styles.container}>
          <Link to={'/orders/'} className={`${styles.menuLink} ${styles.menuLinkBack} ${styles.showTabletHorizontal}`}>
            Back <span className={styles.menuLinkBackMobile}>to physician portal</span>
          </Link>
          {test &&
          <div className={`${styles.containerFlex} ${styles.contentWrapper}`}>
            <section className={styles.adminSection}>
              <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Test result ID: {test.id}</h2>

              <aside className={styles.testInfo}>
                <p className={styles.testInfoString}>
                  <span className={styles.testInfoBold}>Received: </span>
                  {test.received}
                </p>
                <p className={styles.testInfoString}>
                  <span className={styles.testInfoBold}>Order ID: </span>
                  {test.order?.id}
                </p>
                <p className={styles.testInfoString}>
                  <span className={styles.testInfoBold}>Customer ID: </span>
                  {test.order?.customerId}
                </p>
                <p className={styles.testInfoString}>
                  <span className={styles.testInfoBold}>Gender: </span>
                  {test.order?.customerGender === "F" ? 'Female' : 'Male'}
                </p>
                <p className={styles.testInfoString}>
                  <span className={styles.testInfoBold}>Age: </span>
                  31
                </p>
                {!test.approved && <ApproveButton className={`${styles.testInfoBtn} ${styles.btnPrimary}`}
                  text={"Approve results"}
                  selected={[{
                    id: test.id,
                    received: test.received,
                    approved: '',
                    customerId: test.order?.customerId,
                    hash: hash,
                    panicValueBiomarkers: [''],
                    orderId: test.order?.id,
                    criteriaMet: true
                  }]}
                  mode={"result"}
                  onSaved={loadTest} />}
              </aside>

              <div className={styles.comment}>
                <label>
                  <textarea className={styles.commentField}
                    name="comment field"
                    placeholder={'Add your comment here'}></textarea>
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
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et
                    dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea consequat.
                  </p>
                </div>
                <div className={styles.commentItem}>
                  <h4 className={styles.commentItemAuthor}>Vicky Zhao-Silvestro</h4>
                  <span className={styles.commentItemDate}>4/22/2020 9:12AM</span>
                  <p className={styles.commentItemText}>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur nostrud incididunt exercitation.
                  </p>
                </div>
              </div>

            </section>

            <section className={`${styles.orders} ${styles.resultsTable}`}>
              {width > 700 ?
                <MuiThemeProvider theme={detailsTableTheme()}>
                  <MUIDataTable
                    title={''}
                    data={test.biomarkers?.map(biomarkerFormat)}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
                :
                <div className={styles.mobileOrders}>
                  <h2 className={`${styles.heading20} ${styles.mobileOrdersName}`}>Results</h2>
                  {test.biomarkers?.map(biomarkerFormat).map(biomarker =>
                    <div key={biomarker.id} className={styles.mobileOrdersItem}>
                      <p className={styles.mobileOrdersTitle}>Biomarker:&nbsp;
                        <span className={styles.mobileOrdersText}>{biomarker.name}</span></p>
                      <p className={styles.mobileOrdersTitle}>Result:&nbsp;
                        <span className={styles.mobileOrdersText}>{biomarker.value}</span>
                      </p>
                      <p className={styles.mobileOrdersTitle}>Normal range:&nbsp;
                        <span className={styles.mobileOrdersText}>{biomarker.normalRange}</span>
                      </p>
                      <p className={styles.mobileOrdersTitle}>Unit:&nbsp;
                        <span className={styles.mobileOrdersText}>{biomarker.units}</span></p>
                    </div>
                  )}
                </div>
              }
            </section>

          </div>
          }
        </div>
    </section>
  </>
};
export default TestDetailsPage;
