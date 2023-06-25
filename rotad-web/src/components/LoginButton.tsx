import { useCallback } from "react";
import Button from "@mui/material/Button";

export default function LoginButton({ loggedIn }: { loggedIn: boolean }) {
  const loginRedirect = useCallback(() => {console.error("not implemented")}, []);

  return loggedIn ? (
    <Button onClick={loginRedirect} variant="outlined">
      {" "}
      Refresh Login
    </Button>
  ) : (
    <Button onClick={loginRedirect} variant="contained">
      Login
    </Button>
  );
}
