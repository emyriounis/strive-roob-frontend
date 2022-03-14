const archiveProduct = async (product: string, archive: boolean) => {
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/products/archive`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify({ product, archive }),
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

export default archiveProduct;
