import Container from "@mui/material/Container";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Box from "@mui/material/Box";

import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import TopNav from "./components/TopNav";
import useWindowDimentions from "./tools/windowDimentions";
import { ReduxStoreType } from "./types/reduxTypes.d";
import ScrollTop from "./tools/ScrollTop";
import { useEffect, useState } from "react";
import { setUserAction } from "./redux/actions/user";
import meUser from "./api/get/meUser";
import { setLoggedInAction } from "./redux/actions/loggedIn";
import refreshToken from "./api/post/refreshToken";
import Loading from "./tools/Loading";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
import Profile from "./components/Profile";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import ValidateEmail from "./components/ValidateEmail";

const App = () => {
  const { height } = useWindowDimentions();

  const [loading, setLoading] = useState(true);

  const loggedIn = useSelector((state: ReduxStoreType) => state.loggedIn);
  const user = useSelector((state: ReduxStoreType) => state.user);
  const dispatch = useDispatch();

  const getUser = async (retry: boolean) => {
    try {
      const res = await meUser();
      if (res) {
        dispatch(setUserAction(res));
        dispatch(setLoggedInAction(true));
      }
    } catch (error: any) {
      const { text, status } = JSON.parse(error?.message);
      console.log(text, status);
      if (retry) {
        try {
          await refreshToken();
          await getUser(false);
        } catch (error) {
          console.log(error);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => void getUser(true), []);

  if (loading) return <Loading />;

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
      <Router>
        <TopNav />
        <Box
          sx={{
            mt: 8,
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/validateEmail/:token" element={<ValidateEmail />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/resetPassword/:token" element={<ResetPassword />} />

            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Box>
      </Router>
      <Footer />
      <ScrollTop />
    </Container>
  );
};

export default App;
