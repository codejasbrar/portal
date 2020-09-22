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

type LabSlipPagePropsTypes = {};

export type LabSlipInfo = {
  laboratory: string,
  customer: Customer,
  order: string
}

const defaultLabSlipInfo: LabSlipInfo = {
  laboratory: '',
  customer: {} as Customer,
  order: ''
}

const LabSlipPage = (props: LabSlipPagePropsTypes) => {
  const [loading, setLoading] = useState(false);
  const [labSlipInfo, setLabSlipInfo] = useState(defaultLabSlipInfo);
  const [biomarkers, setBiomarkers] = useState([] as string[]);
  const [labPanels, setLabPanels] = useState([] as number[] | undefined);
  const [submitted, setSubmitted] = useState(true);
  const [error, setError] = useState('');

  const clear = () => {
    setLabSlipInfo({...defaultLabSlipInfo});
    setLabPanels(undefined);
  };

  const onApprove = async () => {
    setLoading(true);
    const data = {
      id: labSlipInfo.order,
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
      panelCode: '',
      planName: '',
      markers: biomarkers,
      fasting: true,
      status: 'PENDING'
    }

    await LabSlipApiService.createOrder(labSlipInfo.laboratory, data).then((response) => {
      setLoading(false);
      setSubmitted(true);
      setError('');
      clear();
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
  }, [error])


  const isAllRequiredDataFilled = () => labSlipInfo.customer && !!labSlipInfo.customer.id && !!labSlipInfo.customer.firstName && labSlipInfo.laboratory && labPanels && labPanels.length > 0;

  return <section className={styles.LabslipSection}>
    {loading && <Spinner />}
    {submitted ? <div className={styles.SuccessWrapper}>
      <div className={styles.Success}>
        <SuccessIcon />
        <h3 className={styles.SuccessTitle}>Success!</h3>
        <p className={styles.SuccessText}>Your lap slip was created. You can now return to
          the <Link className={styles.SuccessLink} to="/">Physician
            Portal</Link> or <button className={styles.SuccessLink}
            type={'button'}
            onClick={() => setSubmitted(false)}>Custom Lab Slip Tool</button>.
        </p>
      </div>
    </div> : <>
      <CustomerInformation onSetLoading={setLoading} onSetLabSlipInfo={setLabSlipInfo} labSlipInfo={labSlipInfo} />
      <Biomarkers onSetLoading={setLoading}
        onChangeBiomarkersArray={setBiomarkers}
        onChangePanelsArray={setLabPanels}
        selectedPanels={labPanels} />
      <SubmitPanel onDiscard={clear} onSubmit={onApprove} disabledSubmit={!isAllRequiredDataFilled()} />
      <Popup show={!!error.length} onClose={() => setError('')}>
        <h4 className={styles.heading20}>{error}</h4>
      </Popup>
    </>}
  </section>
};

export default LabSlipPage;