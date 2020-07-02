import {IAuth} from "../services/AuthApiService";

type TokenData = {
  token: string | null,
  expiresAt: string | null,
  refreshToken: string | null
};

class Token {
  static set(tokenData: IAuth) {
    localStorage.setItem('token', tokenData.token);
    localStorage.setItem('expiresAt', this.expiresAt(tokenData.expiresIn));
    localStorage.setItem('refreshToken', tokenData.refreshToken);
  }

  static get = (): TokenData => ({
    token: localStorage.getItem('token'),
    expiresAt: localStorage.getItem('expiresAt'),
    refreshToken: localStorage.getItem('refreshToken'),
  });

  static remove = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('expiresAt');
    localStorage.removeItem('refreshToken');
  };

  private static expiresAt = (expiresIn: number) => new Date((Date.now() + expiresIn * 1000)).toString();

  static isTokenExpired() {
    const tokenData = this.get();
    const now = new Date();
    return tokenData.expiresAt ? new Date(tokenData.expiresAt) <= now : true;
  };
}

export default Token;