import React, {useEffect} from "react";
import {Route, Redirect} from "react-router-dom";
import UserStore from "../../stores/UserStore";
import AuthStore from "../../stores/AuthStore";
import LoadingStore from "../../stores/LoadingStore";

type PrivateRoutePropsTypes = {
  component: React.FC,
  path: string,
  exact?: boolean,
  adminOnly?: boolean,
}

const PrivateRoute: React.FC<PrivateRoutePropsTypes> = (props) => {
  const {loggedIn} = AuthStore;
  const {isAdmin} = UserStore;
  const {saveEntrypoint} = LoadingStore;
  const condition = props.adminOnly ? loggedIn && isAdmin : loggedIn;

  useEffect(() => {
    // @ts-ignore
    saveEntrypoint(props.location.pathname);
  }, []);

  return condition ? (<Route path={props.path} exact={props.exact || false} component={props.component} />) :
    (<Redirect to={props.adminOnly ? "/" : "/authentication"} />);
};
export default PrivateRoute;
