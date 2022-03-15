import { CustomerType } from "../../types/app";

const updateCustomer = async (customerInfo: CustomerType) => {
  const response = await fetch(`${process.env.REACT_APP_BE_URL}/customers`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(customerInfo),
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

export default updateCustomer;
