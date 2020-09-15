import React, {useEffect, useMemo, useState} from "react";

//Styles
import styles from "../../../pages/Labslip/LabSlipPage.module.scss";
import Autocomplete, {Option} from "../../Autocomplete/Autocomplete";
import {TestDetails} from "../../../interfaces/Test";
import LabSlipApiService from "../../../services/LabSlipApiService";
import {debounce} from "@material-ui/core";
import {Order, OrderDetails} from "../../../interfaces/Order";
import SingleSelect, {SelectOption} from "../../SingleSelect/SingleSelect";
import {ReactComponent as CloseIcon} from "../../../icons/close.svg";
import Input from "../../Input/Input";
import Popup from "../../Popup/Popup";
import AddCustomerForm, {FormField} from "./AddCustomerForm";
import {LabSlipInfo} from "../../../pages/Labslip/LabSlipPage";
import {on} from "cluster";

type CustomerInformationPropsTypes = {
  onSetLoading: (state: boolean) => void,
  onSetLabSlipInfo: (info: LabSlipInfo) => void,
  labSlipInfo: LabSlipInfo,
};

export type Customer = {
  id: number,
  firstName: string,
  lastName: string,
  orders: OrderDetails[]
};

const formFields: FormField[] = [
  {
    type: 'id',
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
  const [results, setResults] = useState([] as Customer[]);
  const [searchText, setSearchText] = useState('');
  const [popupOpen, setPopupOpen] = useState(false);
  const {onSetLoading, onSetLabSlipInfo, labSlipInfo} = props;
  const {customer, laboratory, order} = labSlipInfo;

  const onSearchChanged = (text: string) => {
    if (customer && customer.id) onSetLabSlipInfo({...labSlipInfo, customer: {} as Customer, order: ''});
    setSearchText(text);
  };

  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText]);

  const onSearch = async (text: string) => {
    try {
      if (text.length <= 1) {
        setResults([]);
        return;
      }
      const results = await LabSlipApiService.searchCustomer(text);
      setResults(results);
    } catch (e) {
      console.log(e)
    }
  };

  const openPopup = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setPopupOpen(true);
  };

  const debouncedSearch = useMemo(() => debounce(onSearch, 700), []);

  const mapResponseToOptions = (customers: Customer[]) => customers.map((customer: Customer) => {
    return {text: `${customer.id} ${customer.firstName} ${customer.lastName}`, value: customer.id.toString()} as Option
  });

  const removeCustomer = () => {
    onSetLabSlipInfo({...labSlipInfo, customer: {} as Customer, order: ''})
    setResults([] as Customer[])
  };

  const onSelectCustomer = (option: Option) => {
    if(option.value === 'NEW_CUSTOMER') {
      onSetLabSlipInfo({...labSlipInfo, customer})
    } else {
      onSetLabSlipInfo({
        ...labSlipInfo,
        customer: results.filter(customer => customer.id === parseInt(option.value))[0]
      });
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const onOrderSelect = (option: SelectOption) => {
    onSetLabSlipInfo({...labSlipInfo, order: option.value});
  };

  const onLabSelect = (option: SelectOption) => {
    onSetLabSlipInfo({...labSlipInfo, laboratory: option.value});
  }

  const autoCompleteValue = customer && customer.id ? `${customer.id} ${customer.firstName} ${customer.lastName}` : '';

  return <>
    <div className={styles.LabslipTop}>
      <div className={styles.container}>
        <h1 className={styles.heading30}>Create lab slip</h1>
        <div className={styles.LabslipInfoWrapper}>
          <SingleSelect className={styles.LabslipInfoItem}
            label="Select a lab"
            options={[{name: "Quest 97520229", value: "Quest"}]}
            value={laboratory}
            onSelect={onLabSelect}
            placeholder="Select a lab" />
          <div className={styles.LabslipInfoItem}>
            <Autocomplete classes={{wrapper: styles.LabslipInfoCustomer}}
              name="customer"
              label="Select a customer"
              placeholder="Enter customer name or ID number"
              options={results ? mapResponseToOptions(results) : []}
              onChange={onSearchChanged}
              onSelect={onSelectCustomer}
              onClear={removeCustomer}
              value={autoCompleteValue}
            />
            {customer && !customer.id ? <p className={styles.LabslipInfoCustomerAdd}>
                Customer does not exist? <a className={styles.linkPrimary} onClick={openPopup} href="#">Add customer
                details</a>
              </p> :
              <></>}
          </div>
          <SingleSelect className={styles.LabslipInfoItem}
            label="Select an order ID (optional)"
            placeholder="Order ID"
            value={labSlipInfo.order}
            onSelect={onOrderSelect}
            options={customer && customer.orders && customer.orders[0].id ? customer.orders.map(order => {return {name: order.id.toString(), value: order.id.toString()}}) : []}
            disabled={!customer.id || customer.orders && !customer.orders[0].id}
          />
        </div>
      </div>
    </div>
    <Popup classes={styles.LabslipCustomerPopupWrapper} onClose={closePopup} show={popupOpen}>
      <div className={styles.LabslipCustomerPopup}>
        <button type="button" onClick={closePopup} className={styles.LabslipCustomerPopupClose}><CloseIcon /></button>
        <h3 className={styles.heading20}>Add customer details</h3>
        <AddCustomerForm onSetCustomer={(customer: Customer) => {
          onSetLabSlipInfo({...labSlipInfo, customer: customer})
          closePopup();
        }} fields={formFields} />
      </div>
    </Popup>
  </>
};

export default CustomerInformation;