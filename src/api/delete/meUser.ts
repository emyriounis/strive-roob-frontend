const meUser = async () => {
  const response = await fetch(`${process.env.REACT_APP_BE_URL}/users/me`, {
    method: "DELETE",
    credentials: "include",
  });

  if (response.ok) {
    return;
  } else {
    throw new Error(
      JSON.stringify({ text: await response.text(), status: response.status })
    );
  }
};

export default meUser;
