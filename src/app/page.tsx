"use client";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import UploadButton from "./upload_button";
import "./styles.css";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});
export default function Home() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box className="home-box">
        <UploadButton />
      </Box>
    </ThemeProvider>
  );
}
