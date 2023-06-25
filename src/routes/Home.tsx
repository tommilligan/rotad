import LoginButton from "src/components/LoginButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useStore from "src/hooks/useStore";
import Upload from "src/components/Upload";
import { LOCAL_STORAGE_KEYS } from "src/constants";
import { useEffect } from "react";

export default function Home() {
  const store = useStore();
  const authToken = store.authToken;

  useEffect(() => {
    const authToken = localStorage.getItem(LOCAL_STORAGE_KEYS.accessToken);
    if (authToken) {
      store.setAuthToken(authToken);
    }
  }, []);

  return (
    <Box style={{ width: "100%", padding: "8px" }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h2">rotad</Typography>
        <LoginButton loggedIn={authToken !== null} />
        {authToken !== null ? <Upload /> : null}
      </Stack>
    </Box>
  );
}
