import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ReduxStoreType } from "../types/reduxTypes";

const Home = () => {
  const user = useSelector((state: ReduxStoreType) => state.user);

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  return <div>Home</div>;
};

export default Home;
