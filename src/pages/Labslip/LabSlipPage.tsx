import React, {useEffect, useState} from "react";

//Styles
import styles from "./LabSlipPage.module.scss";


import Spinner from "../../components/Spinner/Spinner";
import CustomerInformation, {Customer} from "../../components/LabSlipPageParts/CustomerInformation/CustomerInformation";
import Biomarkers from "../../components/LabSlipPageParts/Biomarkers/Biomarkers";
import SubmitPanel from "../../components/LabSlipPageParts/SubmitPanel/SubmitPanel";
import LabSlipApiService from "../../services/LabSlipApiService";
import Popup from "../../components/Popup/Popup";
import {ReactComponent as SuccessIcon} from "../../icons/success.svg";
import {Link} from "react-router-dom";
import {OrderDetails} from "../../interfaces/Order";
import {Panel} from "../../interfaces/Test";
import downloadPDF from "../../helpers/downloadPDF";

type LabSlipPagePropsTypes = {};

export type LabSlipInfo = {
  laboratory: string,
  customer: Customer,
  order: OrderDetails
}

const defaultLabSlipInfo: LabSlipInfo = {
  laboratory: '',
  customer: {} as Customer,
  order: {} as OrderDetails
};

const LabSlipPage = (props: LabSlipPagePropsTypes) => {
  const [loading, setLoading] = useState(false);
  const [labSlipInfo, setLabSlipInfo] = useState(defaultLabSlipInfo);
  const [labPanels, setLabPanels] = useState([] as Panel[]);
  const [labPanelsIds, setLabPanelsIds] = useState([] as number[] | undefined);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [blob, setBlob] = useState({} as Blob);

  const clear = () => {
    setLabSlipInfo({...defaultLabSlipInfo});
    setLabPanelsIds(undefined);
  };

  const onApprove = async () => {
    setLoading(true);
    const data = {
      order: {
        id: labSlipInfo.order.id || '',
        customerId: labSlipInfo.customer.id,
        customerFirstName: labSlipInfo.customer.firstName,
        customerLastName: labSlipInfo.customer.lastName,
        customerGender: labSlipInfo.customer.orders[0].customerGender,
        customerDateOfBirth: labSlipInfo.customer.orders[0].customerDateOfBirth,
        customerPhone: labSlipInfo.customer.orders[0].customerPhone,
        addrState: labSlipInfo.customer.orders[0].addrState,
        addrCity: labSlipInfo.customer.orders[0].addrCity,
        addrZipCode: labSlipInfo.customer.orders[0].addrZipCode,
        addressLine1: labSlipInfo.customer.orders[0].addressLine1,
        addressLine2: labSlipInfo.customer.orders[0].addressLine2,
        panelCode: labSlipInfo.order.panelCode || '',
        planName: labSlipInfo.order.planName || '',
        markers: [],
        fasting: true,
        status: 'PENDING',
      },
      labPanels: labPanels
    };


    await LabSlipApiService.createOrder(labSlipInfo.laboratory, data).then((response) => {
      setLoading(false);
      setSubmitted(true);
      setError('');
      setBlob(new Blob([response.data], {type: "application/pdf"}));
      window.scrollTo(0, 0);
    }).catch(error => {
      setLoading(false);
      setError(`ERROR: ${error.response.data.message}`);
    })
  };

  useEffect(() => {
    if (!!error.length) {
      setTimeout(() => {
        setError('');
      }, 6000)
    }
  }, [error]);


  const isAllRequiredDataFilled = () => labSlipInfo.customer && !!labSlipInfo.customer.id && !!labSlipInfo.customer.firstName && labSlipInfo.laboratory && labPanelsIds && labPanelsIds.length > 0 && labSlipInfo.order.status === 'APPROVED';

  return <section className={styles.LabslipSection}>
    {loading && <Spinner />}
    {submitted ? <div className={styles.SuccessWrapper}>
      <div className={styles.Success}>
        <SuccessIcon />
        <h3 className={styles.SuccessTitle}>Success!</h3>
        <p className={styles.SuccessText}>Your lap slip was created! You can now <button className={styles.SuccessLink}
          type={'button'}
          onClick={() => downloadPDF(blob, `${labSlipInfo.customer.id || 0}_${labSlipInfo.order.id || 'custom'}_labslip.pdf`)}>Download
          Lab Slip</button></p>
        <p className={styles.SuccessText}> or return to
          the <Link className={styles.SuccessLink} to="/">Physician
            Portal</Link> or <button className={styles.SuccessLink}
            type={'button'}
            onClick={() => {
              clear();
              setSubmitted(false);
            }}>Custom Lab Slip Tool</button>.
        </p>
      </div>
    </div> : <>
      <CustomerInformation onSetLoading={setLoading} onSetLabSlipInfo={setLabSlipInfo} labSlipInfo={labSlipInfo} />
      <Biomarkers onSetLoading={setLoading}
        onChangeLabPanelsArray={setLabPanels}
        onChangePanelsIdsArray={setLabPanelsIds}
        selectedPanels={labPanelsIds}
        preSelectedPanel={labSlipInfo.order.panelCode || 0}
      />
      <SubmitPanel onDiscard={clear} onSubmit={onApprove} disabledSubmit={!isAllRequiredDataFilled()} />
      <Popup show={!!error.length} onClose={() => setError('')}>
        <h4 className={styles.heading20}>{error}</h4>
      </Popup>
    </>}
  </section>
};

export default LabSlipPage;