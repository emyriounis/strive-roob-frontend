const forgotPassword = async (email: string) => {
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/users/forgotPassword`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ email }),
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

export default forgotPassword;
