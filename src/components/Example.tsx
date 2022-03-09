import { useEffect } from "react";
import { useSelector } from "react-redux";
import { ReduxStoreType } from "../types/reduxTypes";

const Example = () => {
  const user = useSelector((state: ReduxStoreType) => state.user);

  useEffect(() => {
    if (!user) window.location.href = "/login";
  }, [user]);

  return <div>Example</div>;
};

export default Example;
