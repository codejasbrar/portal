import React, {useState} from "react";

//Styles
import styles from "./AuthPanel.module.scss";

//Icons
import {ReactComponent as ArrowIcon} from "../../icons/arrow_down.svg";
import {ReactComponent as BurgerIcon} from "../../icons/burger.svg";

//Components
import GoTo from "../GoTo/GoTo";
import ClickOutside from "../ClickOutside/ClickOutside";
import Overlay from "../Overlay/Overlay";
import Button from "../Button/Button";
import {useHistory} from "react-router-dom";
import BodyScroll from "../../helpers/bodyScrollLock";
import UserStore from "../../stores/UserStore";
import AuthStore from "../../stores/AuthStore";
import {observer} from "mobx-react";


const AuthPanel = observer(() => {
  const {user, physician} = UserStore;
  const {loggedIn, logout} = AuthStore;
  const history = useHistory();

  const [openedDropdown, setOpenedDropdown] = useState(false);
  const [openedAside, setOpenedAside] = useState(false);

  const authed = loggedIn && !!Object.keys(user).length;


  const handleLogOut = () => {
    logout();
    history.replace("/authentication/logout");
    closeDropDownHandler();
    closeAside();
  };

  const toggleDropdownHandler = () => {
    setOpenedDropdown(!openedDropdown);
  };

  const closeDropDownHandler = () => {
    setOpenedDropdown(false);
  };

  const openAside = () => {
    BodyScroll.disable();
    setOpenedAside(true);
  };

  const closeAside = () => {
    BodyScroll.enable();
    setOpenedAside(false);
  };

  const goToLogin = () => {
    history.replace("/authentication/login");
    closeAside();
  };

  const physicainFullName = () => `${physician.prefix ? physician.prefix + ' ' : ''}${physician.firstName} ${physician.secondName}${physician.postfix ? ' ' + physician.postfix : ''}`;

  const UserLogo = () => <div className={styles.UserLogo}>
    <span className={styles.UserLogoChar}>{physician ? physician.firstName.slice(0, 1) : user.email.slice(0, 1)}</span>
    <span className={styles.UserLogoChar}>{physician ? physician.secondName.slice(0, 1) : ''}</span>
  </div>;

  return (
    <div className={styles.UserPanel}>
      {authed ?
        <div className={styles.UserPanelDesktop}>
          <UserLogo />
          <ClickOutside onClickOutside={closeDropDownHandler}>
            <button type="button" onClick={toggleDropdownHandler} className={styles.UserName}>
              <span>{physician ? physicainFullName() : user.email}</span><ArrowIcon
              className={`${styles.UserArrow} ${openedDropdown ? styles.UserArrowFlipped : ''}`} />
            </button>
            <div className={`${styles.UserLogout} ${openedDropdown ? '' : styles.UserLogoutHided}`}>
              <button className={`${styles.UserLogoutBtn} ${openedDropdown ? '' : styles.UserLogoutBtnHided}`}
                onClick={handleLogOut}>Log Out
              </button>
            </div>
          </ClickOutside>
        </div> :
        <GoTo className={`${styles.UserName} ${styles.loginBtn}`} path="/authentication/login">Log In</GoTo>}
      <button type="button" onClick={openAside} className={styles.AsideOpener}><BurgerIcon /></button>
      <ClickOutside onClickOutside={closeAside}>
        <aside className={`${styles.UserPanelMobile} ${openedAside ? '' : styles.UserPanelMobileHided}`}>
          <div className={styles.Aside}>
            <div className={styles.AsideTop}>
              {authed && <UserLogo />}
              {authed &&
              <p className={styles.UserName}>{physician ? physicainFullName() : user.email}</p>}
            </div>
            <div className={styles.AsideBtnBlock}>
              {authed ? <Button onClick={handleLogOut} secondary>Log out</Button> :
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
});


export default AuthPanel;
