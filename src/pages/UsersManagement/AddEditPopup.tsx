import React, {useEffect, useState} from 'react';
import Popup from "../../components/Popup/Popup";
import {UserRequestInfoDto} from "../../interfaces/User";
import UsersService from "../../services/UsersService";
import handleReject from "../../helpers/handleReject";
import Input from "../../components/Input/Input";
import {
  camelToWords,
  getInitialErrors,
  getInitialPhysicianForm,
  getInitialUserForm,
  PhysicianForm,
  UserForm
} from "./utils";
import State from "../../interfaces/State";
import {mergeState} from "../../helpers/setState";
import styles from './Users.module.scss';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {FormControlLabel, Switch, TextField} from "@material-ui/core";
import {roles} from "../../constants/roles";
import Button from "../../components/Button/Button";
import Spinner from "../../components/Spinner/Spinner";

interface Props {
  show: boolean;
  onClose: () => void;
  userId?: number;
  statesList: State[];
  onSave: () => void;
}

const AddEditPopup = ({
                        show,
                        onClose,
                        userId,
                        statesList,
                        onSave
                      }: Props) => {
  const [userForm, setUserForm] = useState(getInitialUserForm);
  const [errors, setErrors] = useState(getInitialErrors);
  const [physicianForm, setPhysicianForm] = useState(getInitialPhysicianForm);
  const [physicianStates, setPhysicianStates] = useState<State[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);

    UsersService.getUserById(userId).then(data => {
      const {physician, id, ...user} = data;
      setUserForm({
        ...getInitialUserForm(),
        ...user,
        isPhysician: !!physician
      });
      if (physician) {
        const {id, states, ...physicianFormData} = physician;
        if (states) {
          setPhysicianStates(statesList.filter(state => states.includes(state.abbr)));
        }
        setPhysicianForm({
          ...getInitialPhysicianForm(),
          ...physicianFormData
        })
      }
    }).catch(handleReject).finally(() => setIsLoading(false));
  }, [userId]);

  if (isLoading) {
    return <Spinner />
  }

  const passwordError = (userForm.password !== userForm.confirmPassword) ? 'Passwords don\'t match' : '';
  const isValid = !Object.values(errors).join('') && !passwordError;

  const saveUser = (e: React.FormEvent) => {
    e.preventDefault();
    const {email, password, isPhysician, skip2fa, roles} = userForm;

    const dto: UserRequestInfoDto = {
      email,
      password,
      skip2fa,
      roles,
      physician: !isPhysician ? null : {
        ...physicianForm,
        states: physicianStates.map(state => state.abbr)
      }
    };

    let req = userId ? UsersService.patchUser(dto, userId) : UsersService.createUser(dto);
    req.then(() => {
      alert(`User ${userId ? 'patched' : 'created'} successfully`);
      onClose();
      onSave();
    }).catch(err => {
      const responseErrors = err?.response?.data?.errors
      if (!responseErrors) {
        handleReject(err);
      } else {
        const mappedErrors = getInitialErrors();
        const exceptions = [];
        for (let key in responseErrors) {
          if (key in mappedErrors) {
            mappedErrors[key as keyof typeof mappedErrors] = (responseErrors[key] as string[]).join(', ');
          } else {
            exceptions.push(responseErrors[key]);
          }
        }
        if (exceptions.length) {
          handleReject(exceptions.join(', '));
        }
        setErrors(mappedErrors);
      }
    });
  }

  const mergeUserInput = <T extends keyof UserForm>(
    field: T
  ) => (value: UserForm[T]) => {
    mergeState(setUserForm, {[field]: value});
    mergeState(setErrors, {[field]: ''});
  }

  const mergePhysicianInput = <T extends keyof PhysicianForm>(
    field: T
  ) => (value: PhysicianForm[T]) => {
    mergeState(setPhysicianForm, {[field]: value});
    mergeState(setErrors, {[`physician.${field}`]: ''});
  }

  return <Popup
    show={show}
    onClose={onClose}
  >
    <h3>
      Enter user data:
    </h3>

    <form onSubmit={saveUser}>
      <div className={styles.grid}>
        <Input
          label="Email"
          value={userForm.email}
          onChange={mergeUserInput('email')}
          name="email"
          errorMessage={errors.email}
        />
        <Input
          label="Password"
          type="password"
          value={userForm.password}
          onChange={mergeUserInput('password')}
          name="password"
          errorMessage={errors.password}
        />
        <Input
          label="Confirm password"
          type="password"
          value={userForm.confirmPassword}
          onChange={mergeUserInput('confirmPassword')}
          name="confirmPassword"
          errorMessage={passwordError}
        />
        <div>
          <Autocomplete
            value={userForm.roles}
            onChange={(e, val) => mergeUserInput('roles')(val)}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                label="Roles"
              />
            )}
            multiple
            id="roles"
            options={roles}
            getOptionLabel={(option) => option}
          />
          <span className={styles.error}>
            {errors.roles}
          </span>
        </div>
        <div>
          <FormControlLabel
            control={<Switch
              color="primary"
              checked={userForm.skip2fa}
              id="skip2fa"
              onChange={(e, val) => mergeUserInput('skip2fa')(val)}
            />}
            label="Skip 2FA"
          />
        </div>
        <div>
          <FormControlLabel
            control={<Switch
              color="primary"
              checked={userForm.isPhysician}
              id="is-physician"
              onChange={(e, val) => mergeUserInput('isPhysician')(val)}
            />}
            label="User is physician"
          />
        </div>
        {userForm.isPhysician && <>
          {(Object.keys(physicianForm) as (keyof PhysicianForm)[]).map((field) => <Input
            key={field}
            label={camelToWords(field)}
            value={physicianForm[field]}
            onChange={mergePhysicianInput(field)}
            name={field}
            //@ts-ignore
            errorMessage={errors[`physician.${field}`]}
          />)}
          <div>
            <Autocomplete
              value={physicianStates}
              onChange={(e, val) => {
                setPhysicianStates(val);
                mergeState(setErrors, {"physician.states": ''})
              }}
              filterSelectedOptions
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="States"
                  size="small"
                />
              )}
              multiple
              id="states"
              options={statesList}
              getOptionLabel={(option) => option.name}
            />
            <span className={styles.error}>
              {errors["physician.states"]}
            </span>
          </div>
        </>}
      </div>

      <div className={styles.buttonRow}>
        <Button type="submit" disabled={!isValid}>
          Submit
        </Button>
      </div>
    </form>

  </Popup>
}

export default AddEditPopup;
