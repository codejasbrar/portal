import {combineReducers} from "redux";
import auth from "./authReducer";
import user from "./userReducer";
import orders from "./ordersReducer";
import tests from "./testsReducer";
import counters from "./countersReducer";


export default combineReducers({auth, user, orders, tests, counters});
