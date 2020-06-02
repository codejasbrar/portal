import {User} from "./User";

export interface AppState {
  loggedIn: boolean,
  user: User
}