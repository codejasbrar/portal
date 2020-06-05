import React, {ReactElement} from "react";

//Styles
import styles from "./Button.module.scss";

type ButtonPropsTypes = {
  className?: string,
  children: ReactElement[] | ReactElement | string,
  secondary?: boolean,
  glass?: boolean,
  onClick?: () => void,
  type?: "button" | "submit" | "reset"
};

const Button = (props: ButtonPropsTypes) =>
  <button type={props.type || "button"}
    className={`${styles.Button} ${props.secondary ? styles.ButtonSecondary : ''} ${props.glass ? styles.ButtonGlass : ''} ${props.className ? props.className : ''}`}
    onClick={props.onClick}>
    {props.children}
  </button>;

export default Button;