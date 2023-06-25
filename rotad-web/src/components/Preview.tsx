import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Dayjs } from "dayjs";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { toRFC3339 } from "src/utils";

export interface Data {
  title: string;
  start: Dayjs;
  end: Dayjs;
}

export default function RotaPreview({ rows }: { rows: Array<Data> }) {
  return rows.length === 0 ? null : (
    <>
      <Alert severity="info">
        <Stack>
          <Typography variant="p">
            <code>rotad</code> will create <b>{rows.length} events</b>, starting
            on <b>{toRFC3339(rows[0].start)}</b> and ending on{" "}
            <b>{toRFC3339(rows[rows.length - 1].start)}</b>
          </Typography>
        </Stack>
      </Alert>
      <Paper sx={{ width: 600, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 320 }}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell style={{ minWidth: 200 }}> Title </TableCell>
                <TableCell> Start </TableCell>
                <TableCell> End </TableCell>
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
                    <TableCell> {row.title} </TableCell>
                    <TableCell> {toRFC3339(row.start)} </TableCell>
                    <TableCell> {toRFC3339(row.end)} </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  );
}
