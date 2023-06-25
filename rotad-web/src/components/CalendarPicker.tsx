import useCalendarList from "src/hooks/useCalendarList";
import { LOCAL_STORAGE_KEYS } from "src/constants";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import CircleIcon from "@mui/icons-material/Circle";

export interface Calendar {
  id: string;
  summary: string;
}

interface CalendarPickerProps {
  value: Calendar | null;
  onChange: (calendar: Calendar | null) => void;
}

export default function CalendarPicker({
  value,
  onChange,
}: CalendarPickerProps) {
  const calendarList = useCalendarList();
  const handleChange = (event: SelectChangeEvent) => {
    const newId = event.target.value as string;
    const calendar =
      calendarList.data?.items.find((item) => item.id === newId) ?? null;
    if (calendar !== null) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.lastSelectedCalendar,
        JSON.stringify(calendar)
      );
      onChange(calendar);
    }
  };

  return !calendarList.isSuccess ? (
    <Skeleton width={400} height={56} />
  ) : (
    <>
      <FormControl>
        <InputLabel id="calendar-picker-label">Calendar</InputLabel>
        <Select
          labelId="calendar-picker-label"
          id="calendar-picker"
          value={value?.id ?? ""}
          label="Calendar"
          onChange={handleChange}
          sx={{ width: 400 }}
        >
          {calendarList.data.items.map((item) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Box>
                    <CircleIcon sx={{ color: item.backgroundColor }} />{" "}
                  </Box>
                  <Box>{item.summary}</Box>
                </Stack>
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </>
  );
}
