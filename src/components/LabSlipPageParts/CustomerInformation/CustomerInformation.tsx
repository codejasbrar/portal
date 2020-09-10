import React, {useEffect, useMemo, useState} from "react";

//Styles
import styles from "../../../pages/Labslip/LabSlipPage.module.scss";
import Autocomplete, {Option} from "../../Autocomplete/Autocomplete";
import {TestDetails} from "../../../interfaces/Test";
import LabSlipApiService from "../../../services/LabSlipApiService";
import {debounce} from "@material-ui/core";
import {Order} from "../../../interfaces/Order";
import SingleSelect from "../../SingleSelect/SingleSelect";
import {ReactComponent as CloseIcon} from "../../../icons/close.svg";
import Input from "../../Input/Input";
import Popup from "../../Popup/Popup";
import AddCustomerForm, {FormField} from "./AddCustomerForm";

type CustomerInformationPropsTypes = {
  onSetLoading: (state: boolean) => void,
  customer: Customer,
  onSetCustomer: (customer: Customer) => void
};

export type Customer = {
  customerId: number,
  customerFirstName: string,
  customerLastName: string,
  customerGender: string,
  customerDateOfBirth: string,
  customerPhone: string,
  addrState: string,
  addrCity: string,
  addrZipCode: number,
  addressLine1: string,
  addressLine2: string,
};

const formFields: FormField[] = [
  {
    type: 'text',
    name: 'customerId',
    label: 'Customer ID number',
    required: true
  },
  {
    type: 'text',
    name: 'customerFirstName',
    label: 'First name',
    required: true
  },
  {
    type: 'text',
    name: 'customerLastName',
    label: 'Last name',
    required: true
  },
  {
    type: 'select',
    name: 'customerGender',
    label: 'Gender',
    required: true,
    options: [{name: 'Male', value: 'M'}, {name: 'Female', value: 'F'}],
    placeholder: 'Please select your gender'
  },
  {
    type: 'datepicker',
    name: 'customerDateOfBirth',
    label: 'Date of birth',
    required: true
  },
  {
    type: 'email',
    name: 'customerEmail',
    label: 'Email',
    required: true
  },
  {
    type: 'text',
    name: 'addressLine1',
    label: 'Street adress',
    required: true
  },
  {
    type: 'text',
    name: 'addrCity',
    label: 'City',
    required: true
  },
  {
    type: 'text',
    name: 'addrState',
    label: 'State',
    required: true
  },
  {
    type: 'text',
    name: 'addrZipCode',
    label: 'Zip code',
    required: true
  },
];

const CustomerInformation = (props: CustomerInformationPropsTypes) => {
  const [options, setOptions] = useState([] as Option[]);
  const [searchText, setSearchText] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const {onSetLoading, onSetCustomer, customer} = props;

  const onSearchChanged = (text: string) => {
    if (customer && customer.customerId) onSetCustomer({} as Customer);
    setSearchText(text);
  };

  const onSelectOrder = async (option: Option) => {
    onSetLoading(true);
    try {
      const result = await LabSlipApiService.getResult(option.value);
      onSetCustomer(mapTestToCustomer(result.data));
      setSearchText(result.data.order.id);
    } catch (e) {
      window.confirm('No associated customer');
      setSearchText('');
    }
    onSetLoading(false);
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

  const openPopup = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setPopupOpen(true);
  };

  const debouncedSearch = useMemo(() => debounce(onSearch, 700), []);

  const mapOrdersToOptions = (orders: Order[]) => orders.map((order: Order) => {
    return {text: `Order ID: ${order.id}; Customer ID: ${order.customerId}`, value: order.hash} as Option
  });

  const removeCustomer = () => {
    props.onSetCustomer({} as Customer);
  };

  const mapTestToCustomer = (test: TestDetails) => {
    return {
      customerId: test.order.customerId,
      customerFirstName: test.order.customerFirstName,
      customerLastName: test.order.customerLastName,
      customerGender: test.order.customerGender,
      customerDateOfBirth: test.order.customerDateOfBirth,
      customerPhone: test.order.customerPhone,
      addrState: test.order.addrState,
      addrCity: test.order.addrCity,
      addrZipCode: test.order.addrZipCode,
      addressLine1: test.order.addressLine1,
      addressLine2: test.order.addressLine2,
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  return <>
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
            onChange={onSearchChanged}
            name={'orderId'} />
          <div className={styles.LabslipInfoItem}>
            <Input classes={{root: styles.LabslipInfoCustomer}}
              name="customer"
              label="Select a customer"
              placeholder="Enter customer name or ID number"
              onChange={(e) => {
                console.log(e)
              }}
              value={customer && customer.customerId ? `${customer.customerFirstName} ${customer.customerLastName}` : ''}
              disabled />
            {customer && !customer.customerId ? <p className={styles.LabslipInfoCustomerAdd}>
                Customer does not exist? <a className={styles.linkPrimary} onClick={openPopup} href="#">Add customer
                details</a>
              </p> :
              <button className={styles.LabslipInfoCustomerClear} onClick={removeCustomer} type={"button"}><CloseIcon />
              </button>}
          </div>
        </div>
      </div>
    </div>
    <Popup classes={styles.LabslipCustomerPopupWrapper} onClose={closePopup} show={popupOpen}>
      <div className={styles.LabslipCustomerPopup}>
        <button type="button" onClick={closePopup} className={styles.LabslipCustomerPopupClose}><CloseIcon /></button>
        <h3 className={styles.heading20}>Add customer details</h3>
        <AddCustomerForm onSetCustomer={(customer: Customer) => {
          onSetCustomer(customer);
          closePopup();
        }} fields={formFields} />
      </div>
    </Popup>
  </>
};

export default CustomerInformation;