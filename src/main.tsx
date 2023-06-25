import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Theme from "src/components/Theme";
import Box from "@mui/material/Box";
import ThemeModeToggle from "src/components/ThemeModeToggle";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const queryClient = new QueryClient();
  return (
    <Theme>
      <CssBaseline>
        <QueryClientProvider client={queryClient}>
          <React.StrictMode>
            <Box sx={{ position: "absolute", top: 8, right: 8 }}>
              <ThemeModeToggle />
            </Box>
            <Container>
              <Home />
            </Container>
          </React.StrictMode>
        </QueryClientProvider>
      </CssBaseline>
    </Theme>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
