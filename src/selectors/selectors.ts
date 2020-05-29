import {User} from "../interfaces/User";
import {AuthState} from "../interfaces/AuthState";


export const authStateToProps = (store: Storage): AuthState => ({...store.auth});
export const userStateToProps = (store: Storage): User => ({...store.user});