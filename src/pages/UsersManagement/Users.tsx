import React, {useEffect, useState} from 'react';
import styles from './Users.module.scss';
import Button from "../../components/Button/Button";
import AddEditPopup from "./AddEditPopup";
import ReferencesService from "../../services/ReferencesService";
import handleReject from "../../helpers/handleReject";
import State from "../../interfaces/State";
import Spinner from "../../components/Spinner/Spinner";
import MUIDataTable, {MUIDataTableColumnDef} from "mui-datatables";
import UsersService from "../../services/UsersService";
import CommonTableTheme from "../../themes/CommonTableTheme";
import {MuiThemeProvider} from "@material-ui/core";
import Popup from "../../components/Popup/Popup";

const Users = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [states, setStates] = useState<State[]>([]);
  const [users, setUsers] = useState<{
    email: string,
    firstName: string,
    secondName: string,
    active: string,
    id: number
  }[]>([]);
  const [popupKey, setPopupKey] = useState(0);
  const [userId, setUserId] = useState(0);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [listKey, setListKey] = useState(0);

  const deleteUser = () => {
    const id = userIdToDelete as number;
    UsersService.deleteUser(id)
      .then(() => {
        alert(`User with id ${id} is deleted`);
        setListKey(key => key + 1);
      })
      .catch(handleReject)
      .finally(() => setUserIdToDelete(null));
  }

  const editUser = (id: number) => {
    setPopupKey(key => key + 1);
    setUserId(id);
    setShowPopup(true);
  }

  const columns: MUIDataTableColumnDef[] = [
    {name: 'id', label: 'id'},
    {name: 'email', label: 'Email'},
    {name: 'firstName', label: 'First Name'},
    {name: 'secondName', label: 'Second Name'},
    {name: 'active', label: 'Active'},
    {
      name: 'edit',
      label: ' ',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta) => {
          return (
            <Button secondary onClick={() => editUser(tableMeta.rowData[0])}>
              Edit
            </Button>
          );
        },
      }
    },
    {
      name: 'delete',
      label: ' ',
      options: {
        filter: false,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta) => {
          return (
            <Button secondary onClick={() => setUserIdToDelete(tableMeta.rowData[0])}>
              Deactivate
            </Button>
          );
        },
      }
    }
  ];

  useEffect(() => {
    UsersService.getUsers().then(list => setUsers(list.map(user => {
      let firstName = '';
      let secondName = '';
      let {email, active, physician, id} = user;
      if (physician) {
        firstName = physician.firstName;
        secondName = physician.secondName;
      }
      return {
        firstName,
        secondName,
        email,
        active: active.toString(),
        id
      };
    }))).catch(handleReject);
  }, [listKey]);

  useEffect(() => {
    ReferencesService.getStates().then(setStates).catch(handleReject);
  }, []);

  return <section className={styles.wrapper}>
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={`${styles.heading30} ${styles.hideTabletHorizontal}`}>User management</h1>
        <div>
          <Button onClick={() => {
            setShowPopup(true);
            setPopupKey(key => key + 1);
          }}>
            Add new user
          </Button>
        </div>
      </div>
      <MuiThemeProvider theme={CommonTableTheme()}>
        <MUIDataTable
          columns={columns}
          data={users}
          title=""
          options={{
            filter: false,
            selectableRows: 'none'
          }} />
      </MuiThemeProvider>
    </div>

    {!users.length && <Spinner />}
    {!states.length && showPopup && <Spinner />}
    <AddEditPopup
      key={popupKey}
      userId={userId}
      show={!!(states.length && showPopup)}
      onClose={() => setShowPopup(false)}
      onSave={() => setListKey(key => key + 1)}
      statesList={states} />

    <Popup show={!!userIdToDelete} onClose={() => setUserIdToDelete(null)}>
      <h3>
        Are you sure you want to deactivate user with id {userIdToDelete}?
      </h3>
      <div className={styles.buttonRow}>
        <Button onClick={() => setUserIdToDelete(null)}
          secondary>
          No
        </Button>
        <Button onClick={deleteUser}>
          Yes
        </Button>
      </div>
    </Popup>
  </section>;
}

export default Users;
