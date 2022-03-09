const updateUser = async (formData: FormData) => {
  const response = await fetch(`${process.env.REACT_APP_BE_URL}/users/me`, {
    method: "PUT",
    body: formData,
    credentials: "include",
  });

  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(
      JSON.stringify({ text: await response.text(), status: response.status })
    );
  }
};

export default updateUser;
