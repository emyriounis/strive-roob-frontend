import { RegisterDataType } from "../../types/apiTypes";

const registerUser = async (registerData: RegisterDataType) => {
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/users/register`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(registerData),
      credentials: "include",
    }
  );

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(
      JSON.stringify({ text: await response.text(), status: response.status })
    );
  }
};

export default registerUser;
