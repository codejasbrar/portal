import client from "./client";
import State from "../interfaces/State";

export default class ReferencesService {
  static getStates = async (): Promise<State[]> =>
    await client.get(`/service/states/list`)
      .then(response => response.data);
}
