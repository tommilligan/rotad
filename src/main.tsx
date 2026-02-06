import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

function App() {
  const queryClient = new QueryClient();
  return (
    <CssBaseline>
      <QueryClientProvider client={queryClient}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          // Not required, as we have timezone support loaded?
          adapterLocale="en-gb"
        >
          <React.StrictMode>
            <Home />
          </React.StrictMode>
        </LocalizationProvider>
      </QueryClientProvider>
    </CssBaseline>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
