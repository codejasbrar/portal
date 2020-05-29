import React from "react";

//Styles
import styles from "./AuthPanel.module.scss";
import {useDispatch, useSelector} from "react-redux";
import {User} from "../../interfaces/User";
import {authStateToProps, userStateToProps} from "../../selectors/selectors";
import {AuthState} from "../../interfaces/AuthState";
import {logIn, logOut} from "../../actions/authActions";
import {loadUserByToken} from "../../actions/userActions";

//PropsTypes
type UserPanelPropsTypes = {
  logOut: () => void,
  user: User
};

const AuthPanel = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: Storage): User => ({...userStateToProps(store)}));
  const auth = useSelector((store: Storage): AuthState => ({...authStateToProps(store)}));
  if (auth.loggedIn && !Object.keys(user).length) loadUserByToken(dispatch);
  return auth && auth.loggedIn ? <UserPanel user={user} logOut={() => logOut(dispatch)} /> :
    <button onClick={() => logIn(dispatch)}>Log in</button>;

};

const UserPanel = (props: UserPanelPropsTypes) => {
  const {user, logOut} = props;
  return (
    <div className={styles.UserPanel}>
      <div className={styles.UserLogo}>
        <span className={styles.UserLogoChar}>{user.first_name.slice(0, 1)}</span>
        <span className={styles.UserLogoChar}>{user.last_name.slice(0, 1)}</span>
      </div>
      <span className={styles.UserName}>{user.first_name}</span>
      <button onClick={logOut}>Log Out</button>
    </div>
  );
};


export default AuthPanel;