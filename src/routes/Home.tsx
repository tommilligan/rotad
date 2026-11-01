import LoginButton from "src/components/LoginButton";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useStore from "src/hooks/useStore";
import Upload from "src/components/Upload";
import { clearToken, loadToken } from "src/auth";
import { useEffect } from "react";

export default function Home() {
  const store = useStore();
  const authToken = store.authToken;
  const authTokenExpiresAt = store.authTokenExpiresAt;

  useEffect(() => {
    const stored = loadToken();
    if (stored) {
      store.setAuthToken(stored.accessToken, stored.expiresAt);
    }
  }, []);

  // Google access tokens are short lived. Log out when the token expires,
  // rather than leaving the UI looking logged in with a token that Google
  // will reject.
  useEffect(() => {
    if (authTokenExpiresAt === null) {
      return;
    }
    const delay = Math.max(authTokenExpiresAt - Date.now(), 0);
    const timeout = setTimeout(() => {
      clearToken();
      store.clearAuthToken();
      store.setAuthError("Your Google login has expired. Please log in again.");
    }, delay);
    return () => clearTimeout(timeout);
  }, [authTokenExpiresAt]);

  return (
    <Box style={{ width: "100%", padding: "8px" }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h2">rotad</Typography>
        {store.authError !== null ? (
          <Alert severity="error">{store.authError}</Alert>
        ) : null}
        <LoginButton loggedIn={authToken !== null} />
        {authToken !== null ? <Upload /> : null}
      </Stack>
    </Box>
  );
}
