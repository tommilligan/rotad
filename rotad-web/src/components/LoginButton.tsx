import { useCallback } from "react";
import Button from "@mui/material/Button";
import useTokenClient from "src/hooks/useTokenClient";

export default function LoginButton({ loggedIn }: { loggedIn: boolean }) {
  const tokenClient = useTokenClient();
  const loginAction = useCallback(() => {
    tokenClient.requestAccessToken();
  }, [tokenClient]);

  return loggedIn ? (
    <Button onClick={loginAction} variant="outlined">
      {" "}
      Refresh Login
    </Button>
  ) : (
    <Button onClick={loginAction} variant="contained">
      Login
    </Button>
  );
}
