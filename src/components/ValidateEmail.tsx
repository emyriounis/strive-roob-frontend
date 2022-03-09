import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Alert from "@mui/material/Alert";

import validateEmail from "../api/post/validateEmail";

const ValidateEmail = () => {
  const { token } = useParams();

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tryValidateEmail = async (retry: boolean) => {
    try {
      if (token) {
        await validateEmail(token);
        setSuccess(true);
      } else {
        setError("No token provided");
      }
    } catch (error: any) {
      const { text } = JSON.parse(error?.message);
      setError(text);
    }
  };
  // validateEmail
  useEffect(() => void tryValidateEmail(true), [token]);
  return (
    <Container maxWidth="xs">
      {success ? (
        <Alert color="success">Your email has been validated</Alert>
      ) : error ? (
        <Alert color="error">{error}</Alert>
      ) : (
        <Alert color="info">Validating your email...</Alert>
      )}
    </Container>
  );
};

export default ValidateEmail;
