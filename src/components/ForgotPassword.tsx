import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

import { ReduxStoreType } from "../types/reduxTypes";
import forgotPassword from "../api/post/forgotPassword";
import { useSnackbar, VariantType } from "notistack";

const ForgotPassword = () => {
  const [success, setSuccess] = useState(false);

  const user = useSelector((state: ReduxStoreType) => state.user);

  const { enqueueSnackbar } = useSnackbar();
  const throwNewSnackbar = (variant: VariantType, message: string) =>
    enqueueSnackbar(message, { variant });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const email = formData.get("email")?.toString();

    if (email) {
      try {
        throwNewSnackbar("info", "Sending email");
        await forgotPassword(email);
        setSuccess(true);
        throwNewSnackbar("success", "Check your email");
      } catch (error: any) {
        const { text } = JSON.parse(error?.message);
        throwNewSnackbar("error", text);
      }
    } else {
      throwNewSnackbar("error", "Please provide an email");
    }
  };

  useEffect(() => {
    console.log(user);

    if (user) window.location.href = "/";
  }, [user]);

  return (
    <Container maxWidth="xs">
      {success ? (
        <Alert color="success">An email has been send to your email</Alert>
      ) : (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          <LockOutlinedIcon />
        </Avatar> */}
          <Typography component="h1" variant="h5">
            Forgot Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                color: "secondary.light",
              }}
            >
              Submit
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/register" variant="body2">
                  Don't have an account? Sign Up
                </Link>
              </Grid>
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ForgotPassword;
