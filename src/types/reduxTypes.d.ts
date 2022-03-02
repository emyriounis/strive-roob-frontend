import { UserType } from "./app";

export interface ReduxStoreType {
  loggedIn: boolean;
  user: UserType | null;
}

export interface LoggedInAction {
  type: "SET_LOGGEDIN";
  payload: boolean;
}

export interface UserAction {
  type: string;
  payload: UserType;
}
