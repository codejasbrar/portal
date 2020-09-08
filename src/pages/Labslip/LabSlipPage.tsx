import React, {useEffect, useMemo, useState} from "react";

//Styles
import styles from "./LabSlipPage.module.scss";
import Input from "../../components/Input/Input";
import SingleSelect from "../../components/SingleSelect/SingleSelect";
import Autocomplete, {Option} from "../../components/Autocomplete/Autocomplete";
import {Order} from "../../interfaces/Order";
import LabSlipApiService from "../../services/LabSlipApiService";
import {debounce} from "@material-ui/core";
import {TestDetails} from "../../interfaces/Test";
import Spinner from "../../components/Spinner/Spinner";

type LabSlipPagePropsTypes = {};

const LabSlipPage = (props: LabSlipPagePropsTypes) => {
  const [options, setOptions] = useState([] as Option[]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [test, setTest] = useState({} as TestDetails);

  const onSelectOrder = async (option: Option) => {
    setLoading(true);
    try {
      const result = await LabSlipApiService.getResult(option.value);
      setTest(result.data);
      setSearchText(result.data.order.id);
    } catch (e) {
      window.confirm('No associated customer');
      setSearchText('');
    }
    setLoading(false);
  };

  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText]);

  const onSearch = async (text: string) => {
    try {
      if (text.length <= 1) {
        setOptions([]);
        return;
      }
      const result = await LabSlipApiService.getAllOrders(text);
      setOptions(result.content.length ? mapOrdersToOptions(result.content) : []);
    } catch (e) {
      console.log(e)
    }
  };

  const debouncedSearch = useMemo(() => debounce(onSearch, 700), []);

  const mapOrdersToOptions = (orders: Order[]) => orders.map((order: Order) => {
    return {text: `Order ID: ${order.id}; Customer ID: ${order.customerId}`, value: order.hash} as Option
  });

  return <section className={styles.LabslipSection}>
    {loading && <Spinner />}
    <div className={styles.LabslipTop}>
      <div className={styles.container}>
        <h1 className={styles.heading30}>Create lab slip</h1>
        <div className={styles.LabslipInfoWrapper}>
          <SingleSelect className={styles.LabslipInfoItem}
            label="Select a lab"
            options={[{name: "Quest 97520229", value: "Quest"}]}
            placeholder="Select a lab" />
          <Autocomplete classes={{wrapper: styles.LabslipInfoItem}}
            label="Select an order ID"
            placeholder="Order ID or Customer ID"
            options={options}
            onSelect={onSelectOrder}
            onChange={setSearchText}
            name={'orderId'} />
          <div className={styles.LabslipInfoItem}>
            <Input className={styles.LabslipInfoCustomer}
              name="customer"
              label="Select a customer"
              placeholder="Enter customer name or ID number"
              onChange={(e) => {
                console.log(e)
              }}
              value={test && test.order ? `${test.order.customerFirstName} ${test.order.customerLastName}` : ''}
              disabled />
            <p className={styles.LabslipInfoCustomerAdd}>
              Customer does not exist? <a className={styles.linkPrimary} href="#">Add customer details</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
};

export default LabSlipPage;