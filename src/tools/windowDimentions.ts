import { useLayoutEffect, useState } from "react";

const useWindowDimentions = () => {
  const [dimentions, setDimentions] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const updateDimentions = () => {
      setDimentions({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", updateDimentions);
    updateDimentions();
    return () => window.removeEventListener("resize", updateDimentions);
  }, []);
  return dimentions;
};

export default useWindowDimentions;
