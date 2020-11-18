import React from "react";

//Styles
import styles from "./Logo.module.scss";

//Components
import {ReactComponent as LogoSvg} from "../../icons/Logo.svg";
import GoTo from "../GoTo/GoTo";


const Logo = () => <GoTo name='logo_button' path="/" className={styles.LogoContainer}><LogoSvg /></GoTo>;

export default Logo;