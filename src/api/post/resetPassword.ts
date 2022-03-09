const resetPassword = async (password: string, token: string) => {
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/users/resetPassword`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ password, token }),
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

export default resetPassword;
