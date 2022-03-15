const archiveCustomer = async (customerEmail: string, archive: boolean) => {
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/customers/archive`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ customerEmail, archive }),
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

export default archiveCustomer;
