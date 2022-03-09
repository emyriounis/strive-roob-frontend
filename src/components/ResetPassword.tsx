import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

import { ReduxStoreType } from "../types/reduxTypes";
import { useSnackbar, VariantType } from "notistack";
import resetPassword from "../api/post/resetPassword";
import { useParams } from "react-router-dom";

const ResetPassword = () => {
  const [success, setSuccess] = useState(false);

  const user = useSelector((state: ReduxStoreType) => state.user);
  const { token } = useParams();

  const { enqueueSnackbar } = useSnackbar();
  const throwNewSnackbar = (variant: VariantType, message: string) =>
    enqueueSnackbar(message, { variant });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const password = formData.get("password")?.toString();

    if (password) {
      try {
        throwNewSnackbar("info", "Sending email");
        await resetPassword(password, token as string);
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
        <Alert color="success">Your password has been successfully reset</Alert>
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
            Reset Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              autoFocus
              margin="normal"
              required
              fullWidth
              name="password"
              label="New Password"
              type="password"
              id="password"
              autoComplete="current-password"
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
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default ResetPassword;
