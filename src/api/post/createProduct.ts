import { ProductType } from "../../types/app";

const createProduct = async (product: ProductType) => {
  const response = await fetch(`${process.env.REACT_APP_BE_URL}/products`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify(product),
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

export default createProduct;
