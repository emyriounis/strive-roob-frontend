import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import useWindowDimentions from "./windowDimentions";

const Loading = () => {
  const { width, height } = useWindowDimentions();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width,
        height,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Loading;
