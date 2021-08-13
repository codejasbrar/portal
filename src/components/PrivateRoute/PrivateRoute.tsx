import React from "react";
import {Route, Redirect} from "react-router-dom";
import UserStore from "../../stores/UserStore";
import AuthStore from "../../stores/AuthStore";
import {Role} from "../../interfaces/User";

type PrivateRoutePropsTypes = {
  component: React.FC,
  path: string,
  exact?: boolean,
  availableFor?: Role[]
}

const PrivateRoute: React.FC<PrivateRoutePropsTypes> = (props) => {
  const {loggedIn} = AuthStore;
  const {availableFor, path, exact, component} = props;
  const isAvailable = availableFor?.includes(UserStore.role);
  const condition = availableFor ? loggedIn && isAvailable : loggedIn;

  return loggedIn ? condition ? (<Route path={path} exact={exact || false} component={component} />) : (
      <Redirect to={"/"} />) :
    (<Redirect to="/authentication/login" />);
};

export default PrivateRoute;
