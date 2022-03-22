import { SubscriptionType } from "../../types/app";

const createSubscription = async (subscription: SubscriptionType) => {
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/subscriptions`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(subscription),
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

export default createSubscription;
