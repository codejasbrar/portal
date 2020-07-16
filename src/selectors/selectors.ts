import {User} from "../interfaces/User";
import {AuthState} from "../interfaces/AuthState";
import {Order, OrdersQuantity, OrdersResponse} from "../interfaces/Order";
import {Test, TestDetails} from "../interfaces/Test";
import {OrdersState} from "../reducers/ordersReducer";
import {TestsState} from "../reducers/testsReducer";


export const authState = (store: Storage): AuthState => store.auth;
export const userState = (store: Storage): User => store.user;
export const ordersState = (store: Storage): OrdersState => store.orders;
export const testsState = (store: Storage): TestsState => store.tests;

export const ordersPendingState = (store: Storage): OrdersResponse => (store.orders.pending);
export const ordersApprovedState = (store: Storage): OrdersResponse => (store.orders.approved);

export const testsPendingState = (store: Storage): OrdersResponse => (store.tests.pending);
export const testsApprovedState = (store: Storage): OrdersResponse => (store.tests.approved);
export const testsIncompleteState = (store: Storage): OrdersResponse => (store.tests.incomplete);

export const resultsQuantity = (store: Storage): OrdersQuantity => (store.counters);

export const testDetails = (store: Storage): TestDetails => (store.tests.details);

export const loggedIn = (store: Storage) => authState(store).loggedIn;
export const loading = (store: Storage) => authState(store).loading;