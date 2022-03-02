import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      200: "#c0d8d8",
      300: "#87b5b5",
      main: "#4aa3a3",
    },
    secondary: {
      light: "#fff",
      main: "#666",
      dark: "#000",
    },
    error: {
      main: "#f00",
    },
  },
});

export default theme;
