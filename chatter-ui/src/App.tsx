import {
  Container,
  createTheme,
  CssBaseline,
  Grid,
  ThemeProvider,
} from "@mui/material";

import { RouterProvider } from "react-router-dom";
import router from "./components/Routes";
import { ApolloProvider } from "@apollo/client";
import client from "./constants/apollo-client";
import Guard from "./components/auth/Guard";
import Header from "./components/header/Header";
import SnackBar from "./components/snackBar/snackBar";
import ChatList from "./components/chat-list/ChatList";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Header />
        <Grid container>
          <Grid size={3}>
            <ChatList />
          </Grid>
          <Grid size={9}>
            <Container>
              <Guard>
                <RouterProvider router={router} />
              </Guard>
            </Container>
          </Grid>
        </Grid>

        <SnackBar />
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
