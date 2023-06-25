import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useCallback, useState } from "react";
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
    [onChange]
  );

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      // Not required, as we have timezone support loaded?
      adapterLocale="en-gb"
    >
      <DatePicker
        label="Start date"
        value={value}
        onChange={(newValue) => onInputChange(newValue)}
      />
    </LocalizationProvider>
  );
}
