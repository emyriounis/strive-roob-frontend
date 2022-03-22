import { SubscriptionType } from "../../types/app";

const updateSubscription = async (subscriptionInfo: SubscriptionType) => {
  const response = await fetch(
    `${process.env.REACT_APP_BE_URL}/subscriptions`,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "PUT",
      body: JSON.stringify(subscriptionInfo),
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

export default updateSubscription;
