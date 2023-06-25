import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AlertTitle from "@mui/material/AlertTitle";
import Link from "@mui/material/Link";
import { Dayjs } from "dayjs";
import { toRFC3339 } from "src/utils";

interface DataLossWarningProps {
  startDate: Dayjs;
  calendarName: string;
  deleteCount: number;
}

export default function DataLossWarning({
  startDate,
  calendarName,
  deleteCount,
}: DataLossWarningProps) {
  return (
    <Alert severity="warning">
      <AlertTitle>Warning</AlertTitle>
      <Stack>
        <Typography variant="body1">
          <b>{deleteCount} events</b> in calendar <b>{calendarName}</b> will be
          deleted.
        </Typography>
        <Typography variant="body1">
          <Link
            href="https://calendar.google.com/calendar/u/0/r/settings/createcalendar"
            target="_blank"
          >
            Create a new calendar
          </Link>{" "}
          to avoid data loss.
        </Typography>
      </Stack>
    </Alert>
  );
}
