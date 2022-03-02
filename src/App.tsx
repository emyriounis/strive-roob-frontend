import Container from "@mui/material/Container";
import { useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";

import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import TopNav from "./components/TopNav";
import useWindowDimentions from "./tools/windowDimentions";
import { ReduxStoreType } from "./types/reduxTypes.d";
import ScrollTop from "./tools/ScrollTop";
import { useEffect } from "react";
import getReduxUser from "./redux/actions/user";

const App = () => {
  const { height } = useWindowDimentions();

  const loggedIn = useSelector((state: ReduxStoreType) => state.loggedIn);
  console.log(loggedIn);

  useEffect(() => void getReduxUser(), []);

  return (
    <Container
      disableGutters
      maxWidth={false}
      sx={{
        minHeight: height,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <TopNav />
      <Box
        sx={{
          mt: 8,
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Router>
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </Box>
      <Footer />
      <ScrollTop />
    </Container>
  );
};

export default App;
