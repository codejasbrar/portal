import React, {useState} from "react";

//Styles
import styles from "./LabSlipPage.module.scss";
import Spinner from "../../components/Spinner/Spinner";
import CustomerInformation, {Customer} from "../../components/LabSlipPageParts/CustomerInformation/CustomerInformation";
import Biomarkers from "../../components/LabSlipPageParts/Biomarkers/Biomarkers";
import SubmitPanel from "../../components/LabSlipPageParts/SubmitPanel/SubmitPanel";

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
  const [labPanels, setLabPanels] = useState([] as number[] | undefined);

  const onDiscard = () => {
    setLabSlipInfo({...defaultLabSlipInfo});
    setLabPanels(undefined);
  };

  const onApprove = () => {
    window.confirm(`${JSON.stringify(labSlipInfo)}; ${JSON.stringify(labPanels)}`)
  };

  const isAllRequiredDataFilled = () => labSlipInfo.customer && !!labSlipInfo.customer.id && !!labSlipInfo.customer.firstName && labSlipInfo.laboratory && labPanels && labPanels.length > 0;

  return <section className={styles.LabslipSection}>
    {loading && <Spinner />}
    <CustomerInformation onSetLoading={setLoading} onSetLabSlipInfo={setLabSlipInfo} labSlipInfo={labSlipInfo}/>
    <Biomarkers onSetLoading={setLoading} onChangePanelsArray={setLabPanels} selectedPanels={labPanels}/>
    <SubmitPanel onDiscard={onDiscard} onSubmit={onApprove} disabledSubmit={!isAllRequiredDataFilled()}/>
  </section>
};

export default LabSlipPage;