import React, {ChangeEvent, useEffect, useState} from 'react';

//Styles
import styles from "../OrdersPages.module.scss";

//Components
import {useDispatch, useSelector} from "react-redux";
import Spinner from "../../../components/Spinner/Spinner";
import {Link, useParams} from "react-router-dom";
import {MuiThemeProvider} from "@material-ui/core/styles";
import {detailsTableTheme} from "../../../themes/CommonTableTheme";
import {ReactComponent as SortIcon} from "../../../icons/sort.svg";
import MUIDataTable, {MUIDataTableCustomHeadRenderer, MUIDataTableOptions} from "mui-datatables";
import {isAdmin, testDetails} from "../../../selectors/selectors";
import {getResult} from "../../../actions/testsActions";
import {reformatItem, useResizeListener} from "../PendingOrdersPage/PendingOrdersPage";
import {Biomarker, TestComment, TestDetails} from "../../../interfaces/Test";
import ApproveButton from "../../../components/ApproveButton/ApproveButton";
import {useHistory} from "react-router-dom";
import LabSlipApiService from "../../../services/LabSlipApiService";
import {ReactComponent as DangerIcon} from "../../../icons/danger.svg";

interface BiomarkerDetails extends Biomarker {
  normalRange: string,
  panic: boolean | 0
}

const columns = [
  {
    name: "name",
    label: "Biomarker",
    options: {
      filter: true,
      sort: true,
      customHeadRender: (columnMeta: MUIDataTableCustomHeadRenderer, updateDirection: (params: any) => any) =>
        (<th key={columnMeta.index} style={{borderBottom: "1px solid #C3C8CD"}}>
          <button className={styles.sortBlock}
            onClick={() => updateDirection(0)}>{columnMeta.label}<span><SortIcon className={`${styles.sortIcon} ${styles.sortIconActive}`} /></span>
          </button>
        </th>),
    }
  },
  {
    name: "value",
    label: "Result",
    options: {
      filter: true,
      sort: false,
      customBodyRender: (value: any, tableMeta: any) => {
        const markersRange = tableMeta.rowData[2] === "N/A" ? null : tableMeta.rowData[2].split(' - ');
        const panic = markersRange ? value <= parseFloat(markersRange[0]) || value >= parseFloat(markersRange[1]) : false;
        return <span className={styles.dotWrapper}>{value}{panic && value ?
          <DangerIcon className={styles.dangerIcon} /> : <></>}</span>;
      },
    }
  },
  {
    //check the CommonTableTheme.ts str:132
    name: "normalRange",
    label: "Normal range",
    options: {
      filter: true,
      sort: false,
    }
  },
  {
    //check the CommonTableTheme.ts str:135
    name: 'addOn',
    label: 'Add-on',
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
  rowHover: false,
  selectableRows: 'none',
  textLabels: {
    body: {
      noMatch: "No results found",
    }
  },
  customSort(items, index, isDesc) {
    return items.sort(sortByName).sort(sortByPanic)
  },

  customRowRender(data, dataIndex, rowIndex) {
    const isAddedOn = data[3];
    return <tr key={btoa(`${dataIndex}-${rowIndex}`)}
      className={`MuiTableRow-root MUIDataTableBodyRow-root-46 ${styles.tableRow} ${isAddedOn ? styles.tableRowHighlighted : ''}`}
      data-testid={`MUIDataTableBodyRow-${rowIndex}`}
      id={`MUIDataTableBodyRow-${rowIndex}`}>
      {data.map(item => <td key={`key${dataIndex}-${rowIndex}-${item}`}
        className="MuiTableCell-root MuiTableCell-body MUIDataTableBodyCell-root-50"
        data-colindex={dataIndex}
        data-testid={`MuiDataTableBodyCell-${dataIndex}-${rowIndex}`}>
        <div className={`MUIDataTableBodyCell-root-50 ${styles.tableRowText}`}
          data-testid={`MuiDataTableBodyCell-${dataIndex}-${rowIndex}`}>{item}</div>
      </td>)}
    </tr>
  }


} as MUIDataTableOptions;

const sortByName = (a: BiomarkerDetails, b: BiomarkerDetails) => a.name > b.name ? 1 : -1;
const sortByPanic = (a: BiomarkerDetails, b: BiomarkerDetails) => a.panic ? -1 : 0;

const commentSentDateFormat = (dateString: string) => {
  const offsetHours = new Date().getTimezoneOffset() / 60;
  const sentDate = new Date(dateString);
  sentDate.setHours(sentDate.getHours() - offsetHours);
  return `${sentDate.getMonth() + 1}/${sentDate.getDate()}/${sentDate.getFullYear()} ${sentDate.toLocaleTimeString()}`
};

const sortCommentsByDate = (a: TestComment, b: TestComment) => new Date(a.sent) > new Date(b.sent) ? -1 : 1;

const TestDetailsPage = () => {
    const width = useResizeListener();
    const [loading, setLoading] = useState(true);
    const admin = useSelector(isAdmin);
    const {hash} = useParams();
    const testSelected = useSelector(testDetails);
    const [test, setTest] = useState({} as TestDetails);
    const dispatch = useDispatch();
    const history = useHistory();
    const [comment, setComment] = useState('');

    useEffect(() => {
      if (testSelected) {
        !admin && testSelected.status === 'INCOMPLETE' ? history.push('/') : setTest(reformatItem(testSelected) as TestDetails);
      }
    }, [testSelected, admin, history]);

    const addComment = async () => {
      if (comment.length && comment.trim().length > 0) {
        await LabSlipApiService.saveMessage(hash, comment);
        setComment('');
        await loadTest();
      }
    };

    const onChangeComment = (e: ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e.target.value.replace(/[^\x00-\x7F]+/ig, ''))
    };

    const loadTest = async () => {
      setLoading(true);
      await dispatch(getResult(hash));
      setLoading(false);
    };


  useEffect(() => {
    loadTest();
  }, []);

  const customerAge = (dateOfBirth: string) => new Date().getFullYear() - new Date(dateOfBirth).getFullYear();

  const biomarkerFormat = (biomarker: Biomarker) => ({
    ...biomarker,
    normalRange: biomarker.maxPanicValue && biomarker.minPanicValue ? `${biomarker.minPanicValue} - ${biomarker.maxPanicValue}` : 'N/A',
    panic: biomarker.maxPanicValue && biomarker.minPanicValue && biomarker.value && (biomarker.value >= biomarker.maxPanicValue || biomarker.value <= biomarker.minPanicValue)
  });

  const panicMarkers = test.biomarkers?.map(biomarkerFormat).filter(marker => marker.panic).sort(sortByName);
  const notPanicMarkers = test.biomarkers?.map(biomarkerFormat).filter(marker => !marker.panic).sort(sortByName);

  const enableApprove = (admin && test.status === 'INCOMPLETE') || (!admin && !test.approved && test.status !== 'INCOMPLETE');

  return <>
    {loading && <Spinner />}
    <section className={`${styles.wrapper} ${styles.detailsWrapper}`}>
      <div className={styles.container}>
        {history.action === 'POP' ? <Link to={'/orders/tests'}
          className={`${styles.menuLink} ${styles.menuLinkBack} ${styles.showTabletHorizontal}`}>
          Back <span className={styles.menuLinkBackMobile}>to physician portal</span>
          </Link> : <button type="button"
            onClick={() => history.goBack()}
            className={`${styles.menuLink} ${styles.menuLinkBack} ${styles.showTabletHorizontal}`}>
            Back <span className={styles.menuLinkBackMobile}>to physician portal</span></button>}
          {test.order &&
          <div className={`${styles.containerFlex} ${styles.contentWrapper}`}>
            <section className={styles.adminSection}>
              <h2 className={`${styles.heading20} ${styles.navigationTitle}`}>Test result ID: {test.id}</h2>

              <aside className={styles.testInfo}>
                <p className={styles.testInfoString}>
                  <span className={styles.testInfoBold}>Received: </span>
                  {test.received?.replace('T', ' ')}
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
                  {customerAge(test.order?.customerDateOfBirth)}
                </p>
                <p className={styles.testInfoString}>
                  <span className={styles.testInfoBold}>Status: </span>
                  {test.status}
                </p>
                {test.approved && <p className={styles.testInfoString}>
                  <span className={styles.testInfoBold}>Approved: </span>
                  {test.approved?.replace('T', ' ')}
                </p>}
                {enableApprove && <ApproveButton className={`${styles.testInfoBtn} ${styles.btnPrimary}`}
                  text={"Approve results"}
                  selected={[{
                    id: test.id,
                    received: test.received,
                    approved: '',
                    observed: '',
                    customerId: test.order?.customerId,
                    hash: hash,
                    panicValueBiomarkers: [''],
                    orderId: test.order?.id,
                    criteriaMet: true
                  }]}
                  mode={"result"}
                  type={test.status === "INCOMPLETE" ? 'pending' : 'approved'}
                  onSaved={loadTest} />}
              </aside>

              <div className={styles.comment}>
                <label className={styles.commentLabel}>
                  <textarea
                    value={comment}
                    maxLength={255}
                    onChange={onChangeComment}
                    className={styles.commentField}
                    name="comment field"
                    placeholder={'Add your comment here'} />
                  <span className={styles.commentCounter}>{comment.length}/255</span>
                </label>
                <div className={styles.commentBtnWrapper}>
                  <button onClick={addComment} className={`${styles.btnPrimary} ${styles.commentBtn} `}>Add</button>
                </div>
              </div>

              <div className={styles.commentList}>
                {test.testResultComments.sort(sortCommentsByDate).map((comment) => <div key={comment.id + comment.sent}
                  className={styles.commentItem}>
                  <h4 className={styles.commentItemAuthor}>{comment.user.physician ? `${comment.user.physician.prefix} ${comment.user.physician.firstName} ${comment.user.physician.secondName}` : comment.user.email}</h4>
                  <span className={styles.commentItemDate}>{commentSentDateFormat(comment.sent)}</span>
                  <p className={styles.commentItemText}>
                    {comment.message}
                  </p>
                </div>)}
              </div>

            </section>

            <section className={`${styles.orders} ${styles.resultsTable}`}>
              {width > 700 ?
                <MuiThemeProvider theme={detailsTableTheme()}>
                  <MUIDataTable
                    title={''}
                    data={[...panicMarkers, ...notPanicMarkers]}
                    columns={columns}
                    options={options}
                  />
                </MuiThemeProvider>
                :
                <div className={styles.mobileOrders}>
                  <h2 className={`${styles.heading20} ${styles.mobileOrdersName}`}>Results</h2>
                  {[...panicMarkers, ...notPanicMarkers].map(biomarker =>
                    <div key={biomarker.id}
                      className={`${styles.mobileOrdersItem} ${biomarker.addOn ? styles.tableRowHighlighted : ''}`}>
                      <p className={styles.mobileOrdersTitle}>Biomarker:&nbsp;
                        <span className={styles.mobileOrdersText}>{biomarker.name}</span></p>
                      <p className={styles.mobileOrdersTitle}>Result:&nbsp;
                        <span className={styles.dotWrapper}>
                          <span className={styles.mobileOrdersText}>{biomarker.value}</span>
                          {biomarker.panic && <DangerIcon className={styles.dangerIcon} />}
                        </span>
                      </p>
                      {/*delete hide-class if Normal Range string is needed*/}
                      {/*<p className={`${styles.mobileOrdersTitle} ${styles.hide}`}>Normal range:&nbsp;*/}
                      {/*  <span className={styles.mobileOrdersText}>{biomarker.normalRange}</span>*/}
                      {/*</p>*/}
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
  }
;
export default TestDetailsPage;
