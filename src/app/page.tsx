import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import UploadButton from "./upload_button";
import "./styles.css";
import Box from "@mui/material/Box";

export default function Home() {
  return (
    <Box className="home-box">
      <UploadButton />
    </Box>
  );
}
