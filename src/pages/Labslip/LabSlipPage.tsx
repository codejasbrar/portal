import React, {useEffect, useState} from "react";

//Styles
import styles from "./LabSlipPage.module.scss";
import Spinner from "../../components/Spinner/Spinner";
import CustomerInformation, {Customer} from "../../components/LabSlipPageParts/CustomerInformation/CustomerInformation";
import Biomarkers from "../../components/LabSlipPageParts/Biomarkers/Biomarkers";

type LabSlipPagePropsTypes = {};

const LabSlipPage = (props: LabSlipPagePropsTypes) => {
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({} as Customer);

  return <section className={styles.LabslipSection}>
    {loading && <Spinner />}
    <CustomerInformation onSetLoading={setLoading} onSetCustomer={setCustomer} customer={customer} />
    <Biomarkers onSetLoading={setLoading} />
  </section>
};

export default LabSlipPage;