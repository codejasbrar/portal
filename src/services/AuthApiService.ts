import client from "./client";
import {AxiosResponse} from 'axios';

export interface IAuth {
  token: string,
  subject: string,
  refresh_token: string,
  issued_at: number,
  expires_at: number
}

export interface AuthData {
  username: string,
  password: string,
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
}
