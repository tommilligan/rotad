import LoginButton from "src/components/LoginButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useStore from "src/hooks/useStore";

export function Home() {
  const store = useStore();
  return (
    <Box style={{ width: "100%", padding: "8px" }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h2">rotad</Typography>
        <Box>
          <LoginButton loggedIn={store.authToken !== null} />
        </Box>
      </Stack>
    </Box>
  );
}
