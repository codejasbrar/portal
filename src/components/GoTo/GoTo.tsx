import React, {ReactElement} from "react";

import {useHistory} from "react-router-dom";

type GoToPropsTypes = {
  path: string,
  children: ReactElement | string,
  className?: string,
  name?: string
};

const GoTo = (props: GoToPropsTypes) => {
  const history = useHistory();
  const goToLink = () => {
    history.replace(props.path);
  };
  return <button name={typeof props.children === 'string' ? props.children.toLowerCase().replace(/\s/gmi, '_') : props.name || 'default_go_to_name'}
    type="button"
    className={props.className}
    onClick={goToLink}>{props.children}</button>
};

export default GoTo;