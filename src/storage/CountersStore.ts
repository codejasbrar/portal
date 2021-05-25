import {makeAutoObservable} from "mobx"
import LabSlipApiService from "../services/LabSlipApiService";
import {OrdersQuantity} from "../interfaces/Order";

class CountersStore {
  counters: OrdersQuantity = {
    pendingResults: 0,
    pendingOrders: 0,
    approvedResults: 0,
    approvedOrders: 0,
    incompleteResults: 0,
  };
  loaded = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  getCounters = async () => {
    this.isLoading = true;
    const counters = await LabSlipApiService.getQuantity();
    this.counters = counters.data;
    this.loaded = true;
    this.isLoading = false;
  }
}

export default new CountersStore();
