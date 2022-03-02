export const SET_LOGGEDIN = "SET_LOGGEDIN";

export const setLoggedInAction = (loggedIn: boolean) => ({
  type: SET_LOGGEDIN,
  payload: loggedIn,
});
