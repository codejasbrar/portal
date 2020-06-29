import {combineReducers} from "redux";
import auth from "./authReducer";
import user from "./userReducer";
import orders from "./ordersReducer";
import tests from "./testsReducer";


export default combineReducers({auth, user, orders, tests});