import {combineReducers} from "redux";
import auth from "./authReducer";
import user from "./userReducer";


export default combineReducers({auth, user});