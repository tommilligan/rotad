import TextField from "@mui/material/TextField";
import { useCallback } from "react";

interface RotaInputProps {
  onChange: (entries: Array<string>) => void;
}

export default function RotaInput({ onChange }: RotaInputProps) {
  const onInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const lines = event.target.value.split("\n");
      onChange(lines);
    },
    [onChange]
  );
  return (
    <TextField
      label="Rota"
      multiline
      rows={22}
      onChange={onInputChange}
      placeholder="Paste your rota column - one day per row"
    />
  );
}
