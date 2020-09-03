import client from "./client";
import {AxiosResponse} from 'axios';

export interface IAuth {
  token: string,
  subject: string,
  refreshToken: string,
  issuedAt: number,
  expiresIn: number
}

export interface AuthData {
  username: string,
  password?: string,
  securityCode?: string
}

export interface LoginError {
  timestamp: number,
  status: number,
  message: string
}

export default class AuthApiService {
  static async authenticate(userData: AuthData): Promise<AxiosResponse> {
    return await client.post('/authenticate', userData)
  };

  static async refreshToken(token: string): Promise<AxiosResponse> {
    return await client.post('/authenticate/refresh', {"refreshToken": token})
  }

  static async requestPasswordReset(email: string): Promise<AxiosResponse> {
    return await client.post('/authenticate/requestPasswordReset', {"email": email})
  }

  static async resetPassword(userData: AuthData): Promise<AxiosResponse> {
    return await client.post('/authenticate/resetPassword', userData);
  }
}

