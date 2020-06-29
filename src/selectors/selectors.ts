import {User} from "../interfaces/User";
import {AuthState} from "../interfaces/AuthState";
import {Order} from "../interfaces/Order";
import {Test} from "../interfaces/Test";


export const authState = (store: Storage): AuthState => ({...store.auth});
export const userState = (store: Storage): User => ({...store.user});

export const ordersPendingState = (store: Storage): Order[] => (store.orders.pending);
export const ordersApprovedState = (store: Storage): Order[] => (store.orders.approved);

export const testsPendingState = (store: Storage): Test[] => (store.tests.pending);
export const testsApprovedState = (store: Storage): Test[] => (store.tests.approved);

export const refreshToken = (store: Storage): string => (store.auth.refreshToken);
export const ordersState = (store: Storage): Order[] => ([...store.orders]);
export const testsState = (store: Storage): Test[] => ([...store.tests]);

export const loggedIn = (store: Storage) => authState(store).loggedIn;
export const loading = (store: Storage) => authState(store).loading;