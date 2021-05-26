import {observable, action, computed} from "mobx";
import {Physician, User} from "../interfaces/User";
import ProfileService from "../services/ProfileService";
import LoadingStore from "./LoadingStore";


class UserStore {
  @observable user: User = {} as User;
  @observable error: Error | null = null;
  @observable isLoading = false;

  @action loadUserByToken = () => {
    (async () => {
      this.isLoading = true;
      try {
        const response = await ProfileService.getProfile();
        this.user = response.data;
        this.isLoading = false;
      } catch (e) {
        this.error = e;
        this.isLoading = false;
      }
    })();
  }

  @action logout = () => {
    this.user = {} as User;
    LoadingStore.clearEntrypoint();
  }

  @computed
  get isUserLoaded() {
    return !!Object.keys(this.user).length;
  }

  @computed
  get physician(): Physician {
    return this.user.physician;
  }

  @computed
  get isAdmin(): boolean {
    return Boolean(this.user.id) && !this.user.physician;
  }
}

export default new UserStore();
