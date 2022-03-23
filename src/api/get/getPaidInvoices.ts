const getPaidInvoices = async () => {
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/invoices/paid`,
    {
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

export default getPaidInvoices;
