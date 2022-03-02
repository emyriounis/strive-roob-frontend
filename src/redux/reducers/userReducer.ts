import { initialState } from "../index";
import { UserAction } from "../../types/reduxTypes.d";
import { SET_USER } from "../actions/user";

const userReducer = (state = initialState.user, action: UserAction) => {
  const { type, payload } = action;

  switch (type) {
    case SET_USER:
      return payload;

    default:
      return state;
  }
};

export default userReducer;
