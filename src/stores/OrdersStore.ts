import {action, observable} from "mobx";
import {OrdersResponse} from "../interfaces/Order";
import LabSlipApiService, {OrderStatus} from "../services/LabSlipApiService";
import AuthStore from "./AuthStore";
import CountersStore from "./CountersStore";

class OrdersStore {
  @observable pending: OrdersResponse | {} = {};
  @observable approved: OrdersResponse | {} = {};
  @observable isLoading: boolean = false;

  @action loadOrdersByStatus = (status: OrderStatus, page: number, sortParam?: string, sortDirection?: 'asc' | 'desc', searchString?: string) => {
    (async () => {
      this.isLoading = true;
      try {
        const response = await LabSlipApiService.getOrdersByStatus(status, page, sortParam || '', sortDirection || 'desc', searchString || '');
        this.pending = status === 'PENDING' ? response : this.pending;
        this.approved = status === 'APPROVED' ? response : this.approved;
        this.isLoading = false;
      } catch (exception) {
        await AuthStore.catchBlock(exception);
        this.isLoading = false;
      }
    })();
  };

  @action saveOrders = async (hashes: string[]) => {
    this.isLoading = true;
    try {
      await LabSlipApiService.saveApprovedOrders(hashes);
      CountersStore.getCounters();
      this.isLoading = false;
    } catch (exception) {
      await AuthStore.catchBlock(exception);
      this.isLoading = false;
    }
  }
}

export default new OrdersStore();
