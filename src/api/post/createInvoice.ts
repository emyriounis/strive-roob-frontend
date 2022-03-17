import { InvoiceType } from "../../types/app";

const createInvoice = async (invoice: InvoiceType) => {
  const response = await fetch(`${process.env.REACT_APP_BE_URL}/invoices`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(invoice),
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

export default createInvoice;
