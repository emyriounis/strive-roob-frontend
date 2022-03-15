import { CustomerType } from "../../types/app";

const createCustomer = async (customer: CustomerType) => {
  const response = await fetch(`${process.env.REACT_APP_BE_URL}/customers`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(customer),
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

export default createCustomer;
