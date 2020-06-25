import {User} from "../interfaces/User";
import {AuthState} from "../interfaces/AuthState";
import {Order} from "../interfaces/Order";


export const authState = (store: Storage): AuthState => ({...store.auth});
export const userState = (store: Storage): User => ({...store.user});
export const ordersState = (store: Storage): Order[] => ({...store.orders});

export const loggedIn = (store: Storage) => authState(store).loggedIn;
export const loading = (store: Storage) => authState(store).loading;