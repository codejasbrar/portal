import {User} from "../interfaces/User";
import {AuthState} from "../interfaces/AuthState";


export const authState = (store: Storage): AuthState => ({...store.auth});
export const userState = (store: Storage): User => ({...store.user});