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
import {PlanPanel} from "../../interfaces/Test";
import downloadPDF from "../../helpers/downloadPDF";
import Button from "../../components/Button/Button";

export type LabSlipInfo = {
  laboratory: number | undefined,
  customer: Customer,
  order: OrderDetails
}

const defaultLabSlipInfo: LabSlipInfo = {
  laboratory: undefined,
  customer: {} as Customer,
  order: {} as OrderDetails
};

const LabSlipPage = () => {
  const [loading, setLoading] = useState(false);
  const [labSlipInfo, setLabSlipInfo] = useState(defaultLabSlipInfo);
  const [labPanels, setLabPanels] = useState([] as PlanPanel[]);
  const [labPanelsIds, setLabPanelsIds] = useState([] as string[] | undefined);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [discardPopupActive, setDiscardPopupActive] = useState(false);
  const [blob, setBlob] = useState({} as Blob);

  const clear = () => {
    setLabSlipInfo({...defaultLabSlipInfo});
    setLabPanelsIds(undefined);
  };

  const onApprove = async () => {
    setLoading(true);
    const data = {
      order: {
        id: labSlipInfo.order.id ?? null,
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
        planName: labSlipInfo.order.planName ?? '',
        planVariantName: labSlipInfo.order.planVariantName ?? '',
        planVariantPrettyName: labSlipInfo.order.planVariantPrettyName ?? '',
        packageId: labSlipInfo.order.packageId ?? null,
        laboratoryId: labSlipInfo.laboratory,
        markers: [],
        fasting: true,
        status: 'PENDING',
      },
      labPanels: labPanels
    };


    await LabSlipApiService.createOrder(labSlipInfo.laboratory as number, data).then((response) => {
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

  const onDiscardLabslip = () => {
    clear();
    setDiscardPopupActive(false);
  };

  const isAllRequiredDataFilled = labSlipInfo.customer && !!labSlipInfo.customer.id && !!labSlipInfo.customer.firstName && labSlipInfo.laboratory && labPanelsIds && labPanelsIds.length > 0;
  const enableCreation = (isAllRequiredDataFilled && !labSlipInfo.order.id) || (isAllRequiredDataFilled && labSlipInfo.order.status === 'APPROVED');

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
        preSelectedPanel={labSlipInfo.order.planVariantName || ''}
        labSlipInfo={labSlipInfo}
      />
      <SubmitPanel onDiscard={() => setDiscardPopupActive(true)}
        onSubmit={onApprove}
        disabledSubmit={!enableCreation} />
      <Popup show={!!error.length} onClose={() => setError('')}>
        <h4 className={styles.heading20}>{error}</h4>
      </Popup>
      <Popup classes={styles.discardPopup} onClose={() => setDiscardPopupActive(false)} show={discardPopupActive}>
        <h4 className={styles.discardPopupTitle}>
          Are you sure you want to discard this lab slip?
        </h4>
        <p className={styles.discardPopupText}>
          This lab slip will be deleted immediately. You cannot undo this action.
        </p>
        <div className={styles.discardPopupActions}>
          <Button secondary
            onClick={() => setDiscardPopupActive(false)}><span>Continue<span className={styles.hideMobile}> editing</span></span></Button>
          <Button onClick={onDiscardLabslip}><span>Discard<span className={styles.hideMobile}> lab slip</span></span></Button>
        </div>
      </Popup>
    </>}
  </section>
};

export default LabSlipPage;
