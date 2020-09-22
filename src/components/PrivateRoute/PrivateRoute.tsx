import React from "react";
import {Route, Redirect} from "react-router-dom";
import {useSelector} from "react-redux";
import {isAdmin, loggedIn} from "../../selectors/selectors";

type PrivateRoutePropsTypes = {
  component: React.FC,
  path: string,
  exact?: boolean,
  adminOnly?: boolean,
}

const PrivateRoute: React.FC<PrivateRoutePropsTypes> = (props) => {
  const isLoggedIn = useSelector(loggedIn);
  const admin = useSelector(isAdmin);
  const condition = props.adminOnly ? isLoggedIn && admin : isLoggedIn;

  return condition ? (<Route path={props.path} exact={props.exact || false} component={props.component} />) :
    (<Redirect to={props.adminOnly && isLoggedIn ? "/" : "/authentication"} />);
};
export default PrivateRoute;