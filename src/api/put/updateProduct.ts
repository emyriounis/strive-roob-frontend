import { ProductType } from "../../types/app";

const updateProduct = async (productInfo: ProductType) => {
  const response = await fetch(`${process.env.REACT_APP_BE_URL}/products`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    method: "PUT",
    body: JSON.stringify(productInfo),
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

export default updateProduct;
