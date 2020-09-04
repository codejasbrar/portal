import React from "react";

//Styles
import styles from "./LabSlipPage.module.scss";
import Input from "../../components/Input/Input";
import SingleSelect from "../../components/SingleSelect/SingleSelect";

type LabSlipPagePropsTypes = {};

const LabSlipPage = (props: LabSlipPagePropsTypes) => {

  return <section className={styles.LabslipSection}>
    <div className={styles.LabslipTop}>
      <div className={styles.container}>
        <h1 className={styles.heading30}>Create lab slip</h1>
        <div className={styles.LabslipInfoWrapper}>
          <SingleSelect className={styles.LabslipInfoItem} label="Select a lab" options={[{name: "Quest 97520229", value: "Quest"}]} placeholder="Select a lab"/>
          <div className={styles.LabslipInfoItem}>
            <Input className={styles.LabslipInfoCustomer} name="customer" label="Select a customer" placeholder="Enter customer name or ID number" onChange={(e) => {
              console.log(e)}} value="" />
              <p className={styles.LabslipInfoCustomerAdd}>
                Customer does not exist? <a className={styles.linkPrimary} href="#!">Add customer details</a>
              </p>
          </div>
          <SingleSelect className={styles.LabslipInfoItem} label="Select an order ID (optional)" placeholder="Order ID" disabled options={[]}/>
        </div>
      </div>
    </div>
  </section>
};

export default LabSlipPage;