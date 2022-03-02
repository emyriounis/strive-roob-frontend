import Link from "@mui/material/Link";
import Container from "@mui/material/Container";

const Footer = () => {
  return (
    <Container
      maxWidth="xl"
      sx={{ px: 1, py: 2, display: "flex", justifyContent: "flex-end" }}
    >
      <Link
        href="https://getroob.com"
        target="_blank"
        sx={{ pl: 3, color: "secondary.main", textDecoration: "none" }}
      >
        About
      </Link>
      <Link
        href="mailto:support@getroob.com"
        target="_blank"
        sx={{ pl: 3, color: "secondary.main", textDecoration: "none" }}
      >
        Contact
      </Link>
    </Container>
  );
};

export default Footer;
