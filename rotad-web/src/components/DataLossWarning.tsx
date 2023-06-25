import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AlertTitle from "@mui/material/AlertTitle";
import Link from "@mui/material/Link";
import { Dayjs } from "dayjs";

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
        <Typography variant="p">
          <code>rotad</code> will delete <b>{deleteCount} events</b> in{" "}
          {calendarName} on or after <b>{startDate.toISOString()}</b>.
        </Typography>
        <Typography variant="p">
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
