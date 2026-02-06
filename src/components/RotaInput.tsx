import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import { useCallback } from "react";
import { LOCAL_STORAGE_KEYS } from "src/constants";

interface RotaInputProps {
  entries: string[];
  onChange: (entries: Array<string>) => void;
}

export default function RotaInput({ entries, onChange }: RotaInputProps) {
  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const lines = event.target.value.split("\n");
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.lastRotaInput,
        JSON.stringify(lines),
      );
      onChange(lines);
    },
    [onChange],
  );
  const value = entries.join("\n");
  return (
    <Tooltip
      title={
        <Stack spacing={1}>
          <Typography variant="body2">
            Paste your rota column here. There should be one day per row.
          </Typography>
          <Typography variant="body2">
            Set the "Start date" above to the day of the first row you paste.
          </Typography>
        </Stack>
      }
      placement="right"
      arrow
    >
      <TextField
        value={value}
        label="Rota"
        multiline
        rows={22}
        onChange={onInputChange}
      />
    </Tooltip>
  );
}
