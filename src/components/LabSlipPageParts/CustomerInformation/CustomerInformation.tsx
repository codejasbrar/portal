import React, {useCallback, useEffect, useMemo, useState} from "react";

//Styles
import styles from "../../../pages/Labslip/LabSlipPage.module.scss";
import Autocomplete, {Option} from "../../Autocomplete/Autocomplete";
import LabSlipApiService from "../../../services/LabSlipApiService";
import {debounce} from "@material-ui/core";
import {OrderDetails} from "../../../interfaces/Order";
import SingleSelect, {SelectOption} from "../../SingleSelect/SingleSelect";
import {ReactComponent as CloseIcon} from "../../../icons/close.svg";
import Popup from "../../Popup/Popup";
import AddCustomerForm, {FormField} from "./AddCustomerForm";
import {LabSlipInfo} from "../../../pages/Labslip/LabSlipPage";
import STATES_ABBRS from "../../../constants/statesAbbrs";

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
    type: 'text',
    name: 'customerPhone',
    label: 'Phone number',
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
    type: 'select',
    name: 'addrState',
    label: 'State',
    required: true,
    placeholder: 'Please select state',
    options: STATES_ABBRS.map(state => {return {name: state.name, value: state.abbr}})
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
  const {onSetLabSlipInfo, labSlipInfo} = props;
  const {customer, laboratory} = labSlipInfo;

  const onSearchChanged = (text: string) => {
    if (customer && customer.id) onSetLabSlipInfo({
      ...labSlipInfo,
      customer: {} as Customer,
      order: {} as OrderDetails
    });
    setSearchText(text);
  };

  const onSearch = useCallback(async (text: string) => {
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
  }, []);

  const debouncedSearch = useMemo(() => debounce(onSearch, 700), [onSearch]);

  useEffect(() => {
    debouncedSearch(searchText);
  }, [searchText, debouncedSearch]);

  const openPopup = () => {
    setPopupOpen(true);
  };

  const mapResponseToOptions = (customers: Customer[]) => customers.map((customer: Customer) => {
    return {text: `${customer.id} ${customer.firstName} ${customer.lastName}`, value: customer.id.toString()} as Option
  });

  const removeCustomer = () => {
    onSetLabSlipInfo({...labSlipInfo, customer: {} as Customer, order: {} as OrderDetails});
    setResults([] as Customer[])
  };

  const onSelectCustomer = (option: Option) => {
    if(option.value === 'NEW_CUSTOMER') {
      onSetLabSlipInfo({...labSlipInfo, customer})
    } else {
      onSetLabSlipInfo({
        ...labSlipInfo,
        customer: results.filter(customer => customer.id === parseInt(option.value))[0],
        order: {} as OrderDetails
      });
    }
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const onOrderSelect = (option: SelectOption) => {
    onSetLabSlipInfo({
      ...labSlipInfo,
      order: customer.orders.filter((order: OrderDetails) => order.id.toString() === option.value)[0]
    });
  };

  const onLabSelect = (option: SelectOption) => {
    onSetLabSlipInfo({...labSlipInfo, laboratory: option.value});
  };

  const pendingOrdersIds = customer && customer.orders ? customer.orders.filter(order => order.status === 'PENDING').map(order => order.id) : [];
  const autoCompleteValue = customer && customer.id ? `${customer.id} ${customer.firstName} ${customer.lastName}` : '';

  return <>
    <div className={styles.LabslipTop}>
      <div className={`${styles.container} ${styles.LabslipTopContainer}`}>
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
                Customer does not exist? <button className={styles.linkPrimary} onClick={openPopup}>Add customer
                details</button>
              </p> :
              <></>}
          </div>
          <SingleSelect className={styles.LabslipInfoItem}
            label="Select an order ID (optional)"
            placeholder="Order ID"
            value={labSlipInfo.order.id ? labSlipInfo.order.id.toString() : ''}
            onSelect={onOrderSelect}
            options={customer && customer.orders && customer.orders[0].id ? customer.orders.map(order => {
              return {
                name: order.id.toString(),
                value: order.id.toString(),
                disabled: pendingOrdersIds.includes(order.id)
              }
            }) : []}
            disabled={!customer.id || (customer.orders && !customer.orders[0].id)}
            error={{
              valid: !pendingOrdersIds.includes(labSlipInfo.order.id),
              message: 'Order needs to be approved by the physician first before a custom lab slip can be created'
            }}
          />
        </div>
      </div>
    </div>
    <Popup classes={styles.LabslipCustomerPopupWrapper} onClose={closePopup} show={popupOpen}>
      <div className={styles.LabslipCustomerPopup}>
        <button type="button" onClick={closePopup} className={styles.LabslipCustomerPopupClose}><CloseIcon /></button>
        <h3 className={styles.heading20}>Add customer details</h3>
        <AddCustomerForm onSetCustomer={(customer: Customer) => {
          onSetLabSlipInfo({...labSlipInfo, customer: customer});
          closePopup();
        }} fields={formFields} />
      </div>
    </Popup>
  </>
};

export default CustomerInformation;
