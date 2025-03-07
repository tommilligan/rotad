import dayjs, { Dayjs } from "dayjs";
import { LOCAL_STORAGE_KEYS } from "src/constants";
import StartPicker from "src/components/StartPicker";
import RotaInput from "src/components/RotaInput";
import PreviewAndUpload from "src/components/PreviewAndUpload";
import CalendarPicker from "src/components/CalendarPicker";
import { Calendar, Shift } from "src/types";
import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);

function parseRow(
  startDate: Dayjs,
  index: number,
  rawRow: string,
  timezone: string
): Shift | null {
  const canonical = rawRow.trim().toLowerCase();
  const base = startDate.add(index, "day");
  let title;
  let start;
  let end;
  switch (canonical) {
    case "o":
    case "off":
    case "":
      return null;
    case "d":
    case "day":
      title = `Day`;
      start = base.hour(9).minute(0).second(0);
      end = base.hour(17).minute(0).second(0);
      break;
    case "n":
    case "night":
      title = `Night`;
      start = base.hour(21).minute(0).second(0);
      end = base.add(1, "day").hour(9).minute(30).second(0);
      break;
    case "gynae":
    case "gynae/obs":
      title = rawRow;
      start = base.hour(9).minute(0).second(0);
      end = base.hour(21).minute(30).second(0);
      break;
    default:
      title = `'${rawRow}' (assumed day)`;
      start = base.hour(9).minute(0).second(0);
      end = base.hour(17).minute(0).second(0);
      break;
  }
  return { title, start: start.tz(timezone), end: end.tz(timezone) };
}

function isShift(shift: Shift | null): shift is Shift {
  return shift !== null;
}

export default function Upload() {
  const defaultCalendarJson = localStorage.getItem(
    LOCAL_STORAGE_KEYS.lastSelectedCalendar
  );
  const defaultCalendar = defaultCalendarJson
    ? JSON.parse(defaultCalendarJson)
    : null;

  const [calendar, setCalendar] = useState<Calendar | null>(defaultCalendar);
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs().local().startOf("day")
  );
  const [rotaInput, setRotaInput] = useState<Array<string>>([]);

  const timezone = dayjs.tz.guess();
  const rows: Array<Shift> = rotaInput
    .map((rawRow, index) => {
      return parseRow(startDate, index, rawRow, timezone);
    })
    .filter(isShift);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={6} xs={12}>
          <Panel>
            <CalendarPicker value={calendar} onChange={setCalendar} />
            <StartPicker value={startDate} onChange={setStartDate} />
            <RotaInput onChange={setRotaInput} />
          </Panel>
        </Grid>
        <Grid item md={6} xs={12}>
          <Panel>
            {calendar !== null && rows.length > 0 ? (
              <PreviewAndUpload
                startDate={startDate}
                calendar={calendar}
                rows={rows}
              />
            ) : (
              <Alert severity="info">Enter data to preview rota</Alert>
            )}
          </Panel>
        </Grid>
      </Grid>
    </>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return (
    <Paper elevation={2}>
      <Box padding={2}>
        <Stack spacing={2}>{children}</Stack>
      </Box>
    </Paper>
  );
}
