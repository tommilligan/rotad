import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { toRFC3339 } from "src/utils";
import { Shift } from "src/types";
import dayjs from "dayjs";

export default function RotaPreview({ rows }: { rows: Array<Shift> }) {
  return rows.length === 0 ? null : (
    <>
      <Alert severity="info">
        <Stack>
          <Typography variant="body1">
            <b>{rows.length} events</b> will be created, from{" "}
            {rows[0].start.format("DD/MM/YYYY")} to{" "}
            {rows[rows.length - 1].start.format("DD/MM/YYYY")}
          </Typography>
          <Typography variant="body1">
            Estimated upload time:{" "}
            <b>
              {dayjs.duration(Math.ceil(rows.length / 3), "seconds").humanize()}
            </b>
          </Typography>
        </Stack>
      </Alert>
      <TableContainer sx={{ maxHeight: 320 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              return (
                <TableRow
                  hover
                  role="checkbox"
                  tabIndex={-1}
                  key={toRFC3339(row.start)}
                >
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{toRFC3339(row.start)}</TableCell>
                  <TableCell>{toRFC3339(row.end)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
