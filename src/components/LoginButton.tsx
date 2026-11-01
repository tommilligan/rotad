import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { clearToken } from "src/auth";
import { LOCAL_STORAGE_KEYS } from "src/constants";
import useStore from "src/hooks/useStore";
import useTokenClient from "src/hooks/useTokenClient";

export default function LoginButton({ loggedIn }: { loggedIn: boolean }) {
  const tokenClient = useTokenClient();
  const queryClient = useQueryClient();
  const authToken = useStore((state) => state.authToken);
  const clearAuthToken = useStore((state) => state.clearAuthToken);

  const loginAction = useCallback(() => {
    tokenClient.requestAccessToken();
  }, [tokenClient]);

  const logoutAction = useCallback(() => {
    // Invalidate the token with Google, not just in this browser.
    if (authToken) {
      google.accounts.oauth2.revoke(authToken, () => {});
    }
    clearToken();
    clearAuthToken();
    // This data belongs to the account that just logged out, and must not be
    // shown to whoever logs in next.
    queryClient.clear();
    localStorage.removeItem(LOCAL_STORAGE_KEYS.lastSelectedCalendar);
  }, [authToken, clearAuthToken, queryClient]);

  return loggedIn ? (
    <Stack direction="row" spacing={1}>
      <Button onClick={loginAction} variant="outlined">
        Refresh Login
      </Button>
      <Button onClick={logoutAction} variant="outlined" color="inherit">
        Logout
      </Button>
    </Stack>
  ) : (
    <Button onClick={loginAction} variant="contained">
      Login
    </Button>
  );
}
