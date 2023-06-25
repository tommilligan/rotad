import LoginButton from "src/components/LoginButton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export function Home() {
  return (
    <Box style={{ width: "100%", padding: "8px" }}>
      <Stack spacing={2} alignItems="center">
        <Typography variant="h2">rotad</Typography>
            <Box>
              <LoginButton loggedIn={false} />
            </Box>
      </Stack>
    </Box>
  );
}
