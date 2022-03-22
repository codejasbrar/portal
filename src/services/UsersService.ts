import client from "./client";
import {User, UserRequestInfoDto} from "../interfaces/User";


export default class UsersService {
  static deleteUser = async (
    id: number
  ): Promise<{}> =>
    await client.delete(`/service/user/${id}`)
      .then(res => res.data);

  static createUser = async (
    userData: UserRequestInfoDto,
  ): Promise<{}> =>
    await client.post('/service/user', userData)
      .then(res => res.data);

  static patchUser = async (
    userData: UserRequestInfoDto,
    id: number
  ): Promise<{}> =>
    await client.patch(`/service/user/${id}`, userData)
      .then(res => res.data);

  static getUserById = async (
    id: number
  ): Promise<User> =>
    await client.get(`/service/user/${id}`)
      .then(response => response.data);

  static getUsers = async (): Promise<User[]> =>
    await client.get(`/service/user/list`)
      .then(response => response.data);
}
