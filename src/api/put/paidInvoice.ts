const paidInvoice = async (stripeId: string, client_secret: string) => {
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/invoices/paid`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ stripeId, client_secret }),
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

export default paidInvoice;
