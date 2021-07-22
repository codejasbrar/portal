import {action, observable} from "mobx";
import {TestDetails} from "../interfaces/Test";
import LabSlipApiService, {TestStatus} from "../services/LabSlipApiService";
import {OrdersResponse} from "../interfaces/Order";
import CountersStore from "./CountersStore";
import AuthStore from "./AuthStore";

class TestsStore {
  @observable pending: OrdersResponse | {} = {};
  @observable approved: OrdersResponse | {} = {};
  @observable incomplete: OrdersResponse | {} = {};
  @observable details: TestDetails | null = null;
  @observable isLoading: boolean = false;


  @action loadResultsByStatus = (status: TestStatus, page: number, sortParam?: string, sortDirection?: 'asc' | 'desc', searchString?: string) => {
    (async () => {
      this.isLoading = true;
      try {
        const response = await LabSlipApiService.getResultsByStatus(status, page, sortParam || '', sortDirection || 'desc', searchString || '');
        this.pending = status === 'PENDING' ? response : this.pending;
        this.approved = status === 'APPROVED' ? response : this.approved;
        this.incomplete = status === 'INCOMPLETE' ? response : this.incomplete;
        this.isLoading = false;
      } catch (exception) {
        await AuthStore.catchBlock(exception);
        this.isLoading = false;
      }
    })();
  };

  @action saveResults = async (hashes: string[], status: TestStatus) => {
    this.isLoading = true;
    try {
      status === "PENDING" && await LabSlipApiService.saveApprovedResults(hashes);
      status === "INCOMPLETE" && await LabSlipApiService.savePendingResults(hashes);
      CountersStore.getCounters();
      this.isLoading = false;
    } catch (exception) {
      await AuthStore.catchBlock(exception);
      this.isLoading = false;
    }
  };

  @action getResult = async (hash: string) => {
    this.isLoading = true;
    try {
      const response = await LabSlipApiService.getResult(hash);
      this.details = response.data;
      this.isLoading = false;
    } catch (e) {
      await AuthStore.catchBlock(e);
      this.isLoading = false;
    }
  }

}

export default new TestsStore();
