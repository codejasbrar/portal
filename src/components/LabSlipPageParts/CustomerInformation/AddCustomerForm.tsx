import React, {useMemo, useState} from "react";

//Styles
import styles from "../../../pages/Labslip/LabSlipPage.module.scss";

import {Customer} from "./CustomerInformation";
import Input from "../../Input/Input";
import SingleSelect, {SelectOption} from "../../SingleSelect/SingleSelect";
import Datepicker from "../../Datepicker/Datepicker";
import Button from "../../Button/Button";
import ValidateFields, {ValidFieldTypes} from "../../../helpers/validateFields";

type AddCustomerFormPropsTypes = {
  onSetCustomer: (customer: Customer) => void,
  fields: FormField[],
  submitText?: string,
  onFormSubmitted?: void
};


export type FormField = {
  type: ValidFieldTypes,
  name: string,
  label: string,
  required: boolean,
  options?: SelectOption[],
  placeholder?: string,
}

interface FormFieldsEnchancedTypes extends FormField {
  value: string,
  error?: {
    valid: boolean,
    message: string
  }
  onChangeValue: (value: string) => void
}

const Field = (props: {
  field: FormFieldsEnchancedTypes
}) => {
  const {field} = props;
  switch (field.type) {
    case "id":
    case "text":
    case "email":
      return <Input error={field.error}
        label={field.label}
        name={field.name}
        onChange={(text: string) => field.onChangeValue(text)} />;
    case "select":
      return <SingleSelect error={field.error}
        onSelect={(option: SelectOption) => field.onChangeValue(option.value)}
        label={'Gender'}
        options={field.options || []}
        placeholder={'Please select gender'} />
    case "datepicker":
      return <Datepicker error={field.error}
        selected={field.value as string}
        onSelect={(text: string) => field.onChangeValue(text)}
        label={field.label}
        name={field.name} />;
    default:
      return <></>;
  }
};

const mapFormFields = (fields: FormField[]) => fields.map((field: FormField) => {
  return {
    ...field, value: '',
    onChangeValue: function (value: string) {
      this.value = value;
    }
  } as FormFieldsEnchancedTypes
});


const AddCustomerForm = (props: AddCustomerFormPropsTypes) => {
  const [error, setError] = useState(false);
  const formFieldsEnchanced = useMemo(() => mapFormFields(props.fields), []);


  const mapFormValuesToCustomerObject = () => {
    const customer = {
      id: 0,
      firstName: '',
      lastName: '',
      orders: [{} as any]
    } as any;
    formFieldsEnchanced.forEach((field: FormFieldsEnchancedTypes) => {
      if(field.name === 'customerId') customer.id = field.value;
      if(field.name === 'customerFirstName') customer.firstName = field.value;
      if(field.name === 'customerLastName') customer.lastName = field.value;
      customer.orders[0][field.name] = field.value;
    });
    return customer;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formFieldsEnchanced.forEach((field: FormFieldsEnchancedTypes) => {
      if (field.required) {
        field.error = undefined;
        const validation = ValidateFields([{name: field.label, type: field.type, value: field.value}]);
        if (!validation.valid) {
          field.error = validation;
          setError(!error);
        }
      }
    });
    const valid = formFieldsEnchanced.filter((field: FormFieldsEnchancedTypes) => field.error).length === 0;
    if (valid) props.onSetCustomer(mapFormValuesToCustomerObject());
    e.currentTarget.reset();
  };

  return <form onSubmit={onSubmit}>
    {formFieldsEnchanced.map((field: FormFieldsEnchancedTypes) => <Field key={`${field.type}_${field.name}`} field={field} />)}
    <Button className={styles.formBtn} type='submit'>{props.submitText || 'Add customer details'}</Button>
  </form>
};

export default AddCustomerForm;