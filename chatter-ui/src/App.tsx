import {
  Container,
  createTheme,
  CssBaseline,
  ThemeProvider,
} from "@mui/material";

import { RouterProvider } from "react-router-dom";
import router from "./components/Routes";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container>
        <RouterProvider router={router} />
      </Container>
      {/* <h1>Dark Mode</h1>
      <Auth /> */}
    </ThemeProvider>
  );
};

export default App;
