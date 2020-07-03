import client from "./client";
import Token from "../helpers/localToken";

export default class ProfileService {
  static getProfile = async () => await client.get('/profile', {
    headers: {
      'Authorization': `Bearer ${Token.get().token}`
    }
  }).then(data => data);
}