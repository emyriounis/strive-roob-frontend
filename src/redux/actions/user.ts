import { UserType } from "../../types/app";

export const SET_USER = "SET_USER";

export const setUserAction = (user: UserType | null) => ({
  type: SET_USER,
  payload: user,
});
