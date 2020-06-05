import React, {useState} from "react";

//Styles
import styles from "../../../components/LoginForm/LoginForm.module.scss";

import {useHistory} from "react-router-dom";
import Input from "../../../components/Input/Input";
import {Link} from "react-router-dom";
import Button from "../../../components/Button/Button";
import ValidateFields from "../../../helpers/validateFields";

const Verification = () => {
  const history = useHistory();
  const [error, setError] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    !submitted ? submitPhone() : submitCode();
  };

  const submitPhone = (): void => {
    const validation = ValidateFields([{name: 'Phone', type: "text", value: phone}]);
    setError(validation.message);
    if (!validation.valid) return;
    setSubmitted(true);
  };
  const submitCode = (): void => {
    const validation = ValidateFields([{name: 'Security code', type: "text", value: code}]);
    setError(validation.message);
    if (!validation.valid) return;
    history.replace('/authentication')
  };

  const preValidatePhone = (num: string) => {
    if ((/[A-Za-z$,&_`~=!"';@§±:#<>%^*./?|}{\[\]]/).test(num)) return;
    setPhone(num);
  };

  return <div className={`${styles.FormWrapper} ${styles.Verification}`}>
    <p className={styles.FormTitle}>SMS Verification</p>
    <p className={`${styles.FormSubtitle} ${styles.VerificationSubtitle}`}>{submitted ? "Enter the security code sent to your mobile phone." : 'Provide a mobile number to which you can receive text messages.'}</p>
    {submitted &&
    <span className={styles.FormText}>Your code is valid for 30 minutes. If you didn't receive the code or need a new one, request it here <button
      className={styles.FormTextLink}
      onClick={() => {
        setSubmitted(false);
        setError('')
      }}>Resend code</button>.</span>}
    <form className={styles.Form} onSubmit={onFormSubmit}>
      {error && <span className={styles.FormError}>{error}</span>}
      {submitted ?
        <Input value={code} onChange={setCode} name={"code"} label={"Security code"} placeholder={"Security code"} /> :
        <Input value={phone}
          onChange={preValidatePhone}
          name={"phone"}
          label={"Phone"}
          placeholder={"+_ (___) ___-____"} />}
      <div className={`${styles.Bottom} ${styles.PasswordRecoveryBottom}`}>
        <Link to="/authentication/login" className={styles.BottomLink}>Back to Log In</Link>
        <div className={`${styles.FormBtn} ${styles.PasswordRecoveryBtn}`}><Button type="submit">Submit</Button></div>
      </div>
    </form>
  </div>
};

export default Verification;