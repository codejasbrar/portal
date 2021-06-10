import {observable, action} from "mobx"
import LabSlipApiService from "../services/LabSlipApiService";
import {OrdersQuantity} from "../interfaces/Order";
import AuthStore from "./AuthStore";

class CountersStore {
  @observable counters: OrdersQuantity = {
    pendingResults: 0,
    pendingOrders: 0,
    approvedResults: 0,
    approvedOrders: 0,
    incompleteResults: 0,
  };
  @observable loaded = false;
  @observable isLoading = false;

  @action getCounters = () => {
    (async () => {
      this.isLoading = true;
      try {
        const counters = await LabSlipApiService.getQuantity();
        this.counters = counters.data;
        this.loaded = true;
        this.isLoading = false;
      } catch (e) {
        await AuthStore.catchBlock(e);
        this.isLoading = false;
      }
    })();
  }
}

export default new CountersStore();
