import {action, observable} from "mobx";
import AuthApiService, {AuthData, LoginError} from "../services/AuthApiService";
import Token from "../helpers/localToken";
import UserStore from "./UserStore";

class AuthStore {
  @observable loggedIn: boolean = false;
  @observable isLoading: boolean = false;
  @observable tempData: AuthData | null = null;
  @observable error: LoginError | null = null;
  @observable message: string | null = null;
  @observable tokenRefreshTried: boolean = false;

  @action refreshToken = (refreshToken: string) => {
    (async () => {
      this.isLoading = true;
      try {
        const response = await AuthApiService.refreshToken(refreshToken);
        Token.set(response.data);
        if (!this.loggedIn) this.tokenRefreshTried = true;
        this.loggedIn = true;
        this.isLoading = false;
      } catch (e) {
        this.error = e;
        this.isLoading = false;
        this.logout();
      }
    })();
  };

  @action setLoggedIn = () => {
    if (!this.loggedIn) this.tokenRefreshTried = true;
    this.loggedIn = true;
    this.isLoading = false;
  };

  @action setRefreshTried = () => {
    this.tokenRefreshTried = true;
  };

  @action login = (authData: AuthData) => {
    (async () => {
      this.isLoading = true;
      try {
        const response = await AuthApiService.authenticate(authData);
        Token.set(response.data);
        UserStore.loadUserByToken();
        this.loggedIn = true;
        this.isLoading = false;
        this.message = null;
        this.tempData = null;
        this.error = null;
      } catch (e) {
        if (e.response && e.response.data.message.includes('2FA')) {
          if (e.response.data.error === 'CODE_INCORRECT') {
            this.isLoading = false;
            this.error = e.response.data;
          } else {
            this.tempData = JSON.parse(e.response.config.data);
            this.message = e.response.data.message;
            this.loggedIn = false;
            this.isLoading = false;
            this.error = null;
          }
        } else {
          this.error = e?.response?.data || {message: 'Something went wrong'};
          this.loggedIn = false;
          this.isLoading = false;
          this.tempData = null;
        }
      }
    })();
  };

  @action storeTempData = (data: AuthData, message?: string) => {
    this.tempData = data;
    if (message) this.message = message
  }

  @action clearTempData = () => {
    this.tempData = null;
    this.message = null;
    this.error = null;
  };

  @action clearError = () => {
    this.error = null;
  }

  @action logout = () => {
    Token.remove();
    this.loggedIn = false;
    UserStore.logout();
  }

  @action catchBlock = async (error: any) => {
    const errorData = error.response;
    if (errorData) {
      if (errorData.status === 403) {
        window.alert('Forbidden');
      }
      if (errorData.message === "Unauthorized" || errorData.status === 401) {
        try {
          this.refreshToken(Token.get().refreshToken as string);
        } catch (e) {
          this.logout();
        }
      }
    }
  };
}

export default new AuthStore();
