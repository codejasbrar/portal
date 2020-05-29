import React, {ReactElement} from "react";

import {useHistory} from "react-router-dom";

type GoToPropsTypes = {
  path: string,
  children: ReactElement,
  className: string
};

const GoTo = (props: GoToPropsTypes) => {
  const history = useHistory();
  const goToLink = () => {
    history.replace(props.path);
  };
  return <button type="button" className={props.className} onClick={goToLink}>{props.children}</button>
};

export default GoTo;