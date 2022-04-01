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
import {
  Alert,
  CircularProgress,
  Container,
  Grid,
  Skeleton,
  Typography,
} from "@mui/material";
import theme from "../styles/theme";
import paidInvoice from "../api/put/paidInvoice";
import { Box } from "@mui/system";

const CheckoutForm = ({ stripeId }: { stripeId: string }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();

      if (!stripe || !elements) {
        setMessage("An unexpected error occured.");
        return;
      }

      setIsPaying(true);

      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${process.env.REACT_APP_FE_URL}/payInvoice/${stripeId}/success`,
        },
      });
      console.log(error);

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Something went wrong.");
      } else {
        setMessage("An unexpected error occured.");
      }

      setIsPaying(false);
    } catch (error: any) {
      console.log(error);

      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "Something went wrong.");
      } else {
        setMessage("An unexpected error occured.");
      }
      setIsPaying(false);
    }
  };

  useEffect(() => setIsLoading(true), []);

  return (
    <Container maxWidth="sm">
      {message && (
        <Alert color="error" onClose={() => setMessage(null)} sx={{ my: 8 }}>
          {message}
        </Alert>
      )}
      {isPaying && (
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      )}
      <form id="payment-form" onSubmit={handleSubmit}>
        {isLoading && (
          <Box>
            <Typography component="div" key="0" variant="h6">
              <Skeleton variant="text" width="100px" />
            </Typography>
            <Typography component="div" key="1" variant="h2">
              <Skeleton />
            </Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Typography component="div" key="2" variant="h6">
                  <Skeleton variant="text" width="80px" />
                </Typography>
                <Typography component="div" key="3" variant="h2">
                  <Skeleton />
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography component="div" key="4" variant="h6">
                  <Skeleton variant="text" width="40px" />
                </Typography>
                <Typography component="div" key="5" variant="h2">
                  <Skeleton />
                </Typography>
              </Grid>
            </Grid>
            <Typography component="div" key="6" variant="h6">
              <Skeleton variant="text" width="70px" />
            </Typography>
            <Typography component="div" key="7" variant="h2">
              <Skeleton />
            </Typography>
            <Typography component="div" key="8" variant="h1">
              <Skeleton />
            </Typography>
          </Box>
        )}
        <PaymentElement onReady={() => isLoading && setIsLoading(false)} />
        {!isLoading && (
          <Button
            variant="contained"
            fullWidth
            disabled={isPaying || !stripe || !elements}
            type="submit"
            sx={{ color: "secondary.light", my: 4 }}
          >
            <span id="button-text">Pay now</span>
          </Button>
        )}
      </form>
    </Container>
  );
};

const PayInvoice = () => {
  const { stripeId, client_secret } = useParams();

  const {
    payment_intent,
  }: {
    payment_intent: string;
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
      <CheckoutForm stripeId={stripeId as string} />
    </Elements>
  );
};

export default PayInvoice;
