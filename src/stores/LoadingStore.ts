import {action, computed, observable} from "mobx";
import AuthStore from "./AuthStore";
import UserStore from "./UserStore";
import CountersStore from "./CountersStore";
import OrdersStore from "./OrdersStore";
import TestsStore from "./TestsStore";

class LoadingStore {
  @observable entrypoint: string = '';

  @action saveEntrypoint = (path: string) => {
    if (!this.entrypoint.length) this.entrypoint = path;
  };

  @action clearEntrypoint = () => {
    this.entrypoint = '';
  };

  @computed
  get loading() {
    const anyLoading = AuthStore.isLoading || UserStore.isLoading || CountersStore.isLoading || OrdersStore.isLoading || TestsStore.isLoading;
    if (process.env.NODE_ENV === 'development' && anyLoading) {
      console.groupCollapsed('LOADING STORES');
      AuthStore.isLoading && console.log('AUTH', AuthStore.isLoading);
      UserStore.isLoading && console.log('USER', UserStore.isLoading);
      CountersStore.isLoading && console.log('COUNTERS', CountersStore.isLoading);
      OrdersStore.isLoading && console.log('ORDERS', OrdersStore.isLoading);
      TestsStore.isLoading && console.log('TESTS', TestsStore.isLoading);
      console.groupEnd();
    }
    return anyLoading;
  }
}

export default new LoadingStore();
