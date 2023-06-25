import "./index.css";
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ReactDOM from "react-dom/client";
import Home from "./routes/Home";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CssBaseline from "@mui/material/CssBaseline";
import Theme from "src/components/Theme";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
  ]);

  const queryClient = new QueryClient();
  return (
    <Theme>
      <CssBaseline>
        <QueryClientProvider client={queryClient}>
          <React.StrictMode>
            <RouterProvider router={router} />
          </React.StrictMode>
        </QueryClientProvider>
      </CssBaseline>
    </Theme>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
