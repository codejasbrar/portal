import React, {useState} from "react";

//Styles
import styles from "./AuthPanel.module.scss";

//Icons
import {ReactComponent as ArrowIcon} from "../../icons/arrow_down.svg";
import {ReactComponent as BurgerIcon} from "../../icons/burger.svg";

//Components
import {useDispatch, useSelector} from "react-redux";
import {User} from "../../interfaces/User";
import {authState, userState} from "../../selectors/selectors";
import {AuthState} from "../../interfaces/AuthState";
import {logOut} from "../../actions/authActions";
import GoTo from "../GoTo/GoTo";
import ClickOutside from "../ClickOutside/ClickOutside";
import Overlay from "../Overlay/Overlay";
import Button from "../Button/Button";
import {useHistory} from "react-router-dom";


const AuthPanel = () => {
  const dispatch = useDispatch();
  const user = useSelector((store: Storage): User => ({...userState(store)}));
  const auth = useSelector((store: Storage): AuthState => ({...authState(store)}));
  const history = useHistory();

  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [openedAside, setOpenedAside] = useState(false);

  const loggedIn = auth && auth.loggedIn && Object.keys(user).length;


  const handleLogOut = () => {
    dispatch(logOut());
    history.replace("/logout");
    closeAside();
  };

  const toggleDropdownHandler = () => {
    setOpenedDropdown(!openedDropdown);
  };

  const closeDropDownHandler = () => {
    setOpenedDropdown(false);
  };

  const openAside = () => {
    setOpenedAside(true);
  };

  const closeAside = () => {
    setOpenedAside(false);
  };

  const goToLogin = () => {
    history.replace("/login");
    closeAside();
  };

  const UserLogo = () => <div className={styles.UserLogo}>
    <span className={styles.UserLogoChar}>{user.first_name.slice(0, 1)}</span>
    <span className={styles.UserLogoChar}>{user.last_name.slice(0, 1)}</span>
  </div>;

  return (
    <div className={styles.UserPanel}>
      {loggedIn ?
        <div className={styles.UserPanelDesktop}>
          <UserLogo />
          <ClickOutside onClickOutside={closeDropDownHandler}>
            <button type="button" onClick={toggleDropdownHandler} className={styles.UserName}>
              <span>{user.first_name}</span><ArrowIcon className={`${styles.UserArrow} ${openedDropdown ? styles.UserArrowFlipped : ''}`} />
            </button>
            <div className={`${styles.UserLogout} ${openedDropdown ? '' : styles.UserLogoutHided}`}>
              <button className={`${styles.UserLogoutBtn} ${openedDropdown ? '' : styles.UserLogoutBtnHided}`}
                onClick={handleLogOut}>Log Out
              </button>
            </div>
          </ClickOutside>
        </div> :
        <GoTo className={`${styles.UserName} ${styles.loginBtn}`} path="/login">Log In</GoTo>}
      <button type="button" onClick={openAside} className={styles.AsideOpener}><BurgerIcon /></button>
      <ClickOutside onClickOutside={closeAside}>
        <aside className={`${styles.UserPanelMobile} ${openedAside ? '' : styles.UserPanelMobileHided}`}>
          <div className={styles.Aside}>
            <div className={styles.AsideTop}>
              {loggedIn && <UserLogo />}
              {loggedIn && <p className={styles.UserName}>{user.first_name} {user.last_name}</p>}
            </div>
            <div className={styles.AsideBtnBlock}>
              {loggedIn ? <Button onClick={handleLogOut} secondary>Log out</Button> :
                <Button onClick={goToLogin} secondary>Log In</Button>}
            </div>
            <div className={styles.AsideBottom}>
              <a href="mailto:contactus@insidetracker.com" className={styles.AsideLink}>contactus@insidetracker.com</a>
              <a href="tel:88005132359" className={styles.AsideLink}>(800) 513-2359</a>
            </div>
          </div>
        </aside>
      </ClickOutside>
      <Overlay show={openedAside} />
    </div>
  );
};


export default AuthPanel;