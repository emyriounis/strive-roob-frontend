import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Button from "@mui/material/Button";
import { Alert, CircularProgress, Container } from "@mui/material";
import theme from "../styles/theme";
import paidInvoice from "../api/put/paidInvoice";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!stripe || !elements) {
        setMessage("An unexpected error occured.");
        return;
      }

      setIsLoading(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.REACT_APP_FE_URL}/payInvoice/success`,
        },
      });
      console.log(error);

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Something went wrong.");
      } else {
        setMessage("An unexpected error occured.");
      }

      setIsLoading(false);
    } catch (error: any) {
      console.log(error);

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Something went wrong.");
      } else {
        setMessage("An unexpected error occured.");
      }
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      {message && (
        <Alert color="error" onClose={() => setMessage(null)} sx={{ my: 8 }}>
          {message}
        </Alert>
      )}
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement />
        <Button
          variant="contained"
          disabled={isLoading || !stripe || !elements}
          type="submit"
          sx={{ color: "secondary.light", my: 4 }}
        >
          <span id="button-text">Pay now</span>
        </Button>
      </form>
      {isLoading && <CircularProgress />}
    </Container>
  );
};

const PayInvoice = () => {
  const { stripeId, client_secret } = useParams();

  const {
    payment_intent,
    payment_intent_client_secret,
  }: {
    payment_intent: string;
    payment_intent_client_secret: string;
  } = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop as string),
  }) as any;

  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string,
    {
      stripeAccount: stripeId,
    }
  );

  const setPaidInvoice = async () => {
    try {
      await paidInvoice(stripeId as string, payment_intent as string);
    } catch (error: any) {
      console.log(error);
    }
  };

  useEffect(() => {
    client_secret === "success" && setPaidInvoice();
  }, [stripeId, client_secret]);

  if (client_secret === "success") {
    return (
      <Container maxWidth="xs">
        <Alert color="success">Successful Payment</Alert>
      </Container>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: client_secret,
        appearance: {
          theme: "stripe",
          variables: {
            colorText: theme.palette.secondary.main,
            colorTextSecondary: theme.palette.primary.main,
            colorTextPlaceholder: theme.palette.primary.main,
          },
        },
      }}
    >
      <CheckoutForm />
    </Elements>
  );
};

export default PayInvoice;
