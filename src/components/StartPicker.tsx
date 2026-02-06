import { Dayjs } from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback } from "react";
import "dayjs/locale/en-gb";

interface StartPickerProps {
  value: Dayjs;
  onChange: (date: Dayjs) => void;
}

export default function StartPicker({ value, onChange }: StartPickerProps) {
  const onInputChange = useCallback(
    (newDate: Dayjs | null) => {
      if (newDate !== null) {
        onChange(newDate.local().startOf("day"));
      }
    },
    [onChange],
  );

  return (
    <DatePicker
      label="Start date"
      value={value}
      onChange={(newValue) => onInputChange(newValue)}
    />
  );
}
