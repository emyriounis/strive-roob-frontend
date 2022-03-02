import refreshToken from "../../api/post/refreshToken";
import { UserType } from "../../types/app";

export const SET_USER = "SET_USER";

export const setUserAction = (user: UserType) => ({
  type: SET_USER,
  payload: user,
});

const getReduxUser = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_BE_URL}/users/me`, {
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);

      setUserAction(data);
    } else {
      await refreshToken();
      await getReduxUser();
    }
  } catch (error) {
    console.log(error);
  }
};

export default getReduxUser;
