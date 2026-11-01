import { useMemo } from "react";
import { GOOGLE_SCOPES } from "src/constants";
import { saveToken } from "src/auth";
import useStore from "src/hooks/useStore";

interface TokenResponse {
  access_token?: string;
  expires_in?: string | number;
  error?: string;
}

interface TokenError {
  type?: string;
}

export default function useTokenClient() {
  const setAuthToken = useStore((state) => state.setAuthToken);
  const setAuthError = useStore((state) => state.setAuthError);

  return useMemo(
    () =>
      google.accounts.oauth2.initTokenClient({
        client_id:
          "94783838569-lju85dpld8gc66ucdk9db83nrplrjo8v.apps.googleusercontent.com",
        scope: GOOGLE_SCOPES.join(" "),
        callback: (response: TokenResponse) => {
          if (response.error || !response.access_token) {
            console.error("Error getting token:", response);
            setAuthError("Login failed. Please try again.");
            return;
          }

          // Users can untick individual permissions on the consent screen.
          // Don't carry on with a token that can't do what we need.
          if (
            !google.accounts.oauth2.hasGrantedAllScopes(
              response,
              ...GOOGLE_SCOPES,
            )
          ) {
            google.accounts.oauth2.revoke(response.access_token, () => {});
            setAuthError(
              "rotad needs all the requested Google Calendar permissions. " +
                "Please log in again, and leave them all ticked.",
            );
            return;
          }

          const expiresIn = Number(response.expires_in);
          if (!Number.isFinite(expiresIn) || expiresIn <= 0) {
            console.error("Token has no valid expiry:", response);
            setAuthError("Login failed. Please try again.");
            return;
          }

          const expiresAt = saveToken(response.access_token, expiresIn);
          setAuthError(null);
          setAuthToken(response.access_token, expiresAt);
        },
        error_callback: (error: TokenError) => {
          // `popup_closed` is the user changing their mind, not an error.
          if (error.type === "popup_failed_to_open") {
            setAuthError(
              "The Google login popup was blocked. Please allow popups for this site, then try again.",
            );
          }
        },
      }),
    [setAuthToken, setAuthError],
  );
}
