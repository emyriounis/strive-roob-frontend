import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

import loginUser from "../api/post/loginUser";
import { ReduxStoreType } from "../types/reduxTypes";
import { setUserAction } from "../redux/actions/user";

const Login = () => {
  const [error, setError] = useState<string | null>(null);

  const user = useSelector((state: ReduxStoreType) => state.user);
  const dispatch = useDispatch();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const identifier = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (identifier && password) {
      try {
        const res = await loginUser({
          identifier,
          password,
        });
        dispatch(setUserAction(res));
      } catch (error: any) {
        const { text } = JSON.parse(error?.message);
        setError(text);
      }
    } else {
      setError("Please provide valid credentials");
    }
  };

  useEffect(() => {
    console.log(user);

    if (user) window.location.href = "/";
  }, [user]);

  return (
    <Container maxWidth="xs">
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
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            error={Boolean(error)}
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            error={Boolean(error)}
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            onChange={() => setError(null)}
          />
          {error && <Alert severity="error">{error}</Alert>}
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
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="/forgotPassword" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/register" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
