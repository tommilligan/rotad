import dayjs, { Dayjs } from "dayjs";
import { LOCAL_STORAGE_KEYS } from "src/constants";
import StartPicker from "src/components/StartPicker";
import RotaInput from "src/components/RotaInput";
import PreviewAndUpload from "src/components/PreviewAndUpload";
import CalendarPicker from "src/components/CalendarPicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Calendar, Shift } from "src/types";
import { useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import duration from "dayjs/plugin/duration";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);

function canonicalize(value: string): string {
  return value.trim().toLowerCase();
}

function DeleteButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton sx={{ ml: 1 }} onClick={onClick} color="inherit">
      <DeleteIcon />
    </IconButton>
  );
}

function AddButton({ onClick }: { onClick: () => void }) {
  return (
    <IconButton sx={{ ml: 1 }} onClick={onClick} color="inherit">
      <AddIcon />
    </IconButton>
  );
}

function newId(): number {
  return Math.floor(Math.random() * 2 ** 64);
}

interface StoredRule {
  id: number;
  match: string;
  startTime: string;
  endTime: string;
  endsNextDay: boolean;
  noEvent: boolean;
  title: string | undefined;
}

interface Rule {
  id: number;
  match: string;
  startTime: Dayjs;
  endTime: Dayjs;
  endsNextDay: boolean;
  noEvent: boolean;
  title: string;
}

function parseRow(
  startDate: Dayjs,
  index: number,
  rawRow: string,
  timezone: string,
  rules: Record<string, Rule>,
): Shift | null {
  const canonical = canonicalize(rawRow);
  if (canonical === "") {
    return null;
  }
  const base = startDate.add(index, "day");
  let title;
  let start;
  let end;

  const rule = rules[canonical] || null;
  if (rule !== null) {
    if (rule.noEvent) {
      return null;
    }

    title = rule.title || rawRow;
    start = base
      .hour(rule.startTime.hour())
      .minute(rule.startTime.minute())
      .second(0);
    end = base
      .hour(rule.endTime.hour())
      .minute(rule.endTime.minute())
      .second(0);
    if (rule.endsNextDay) {
      end = end.add(1, "day");
    }
  } else {
    title = `'${rawRow}' (assumed day)`;
    start = base.hour(9).minute(0).second(0);
    end = base.hour(17).minute(0).second(0);
  }
  return { title, start: start.tz(timezone), end: end.tz(timezone) };
}

function isShift(shift: Shift | null): shift is Shift {
  return shift !== null;
}

function ConfigureRule({
  rule,
  index,
  setRule,
  deleteRule,
}: {
  readonly rule: Rule;
  readonly index: number;
  readonly setRule: (rule: Rule, index: number) => void;
  readonly deleteRule: (index: number) => void;
}) {
  const setRuleWithIndex = (rule: Rule) => {
    setRule(rule, index);
  };
  const onChangeMatch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRuleWithIndex({
      ...rule,
      match: event.target.value,
    });
  };
  const onChangeStartTime = (value: Dayjs | null) =>
    setRuleWithIndex({
      ...rule,
      startTime:
        value || dayjs().local().startOf("day").hour(0).minute(0).second(0),
    });
  const onChangeEndTime = (value: Dayjs | null) =>
    setRuleWithIndex({
      ...rule,
      endTime:
        value || dayjs().local().startOf("day").hour(0).minute(0).second(0),
    });
  const onChangeAddDay = (change: React.ChangeEvent<HTMLInputElement>) =>
    setRuleWithIndex({
      ...rule,
      endsNextDay: change.target.checked,
    });
  const onChangeNoEvent = (change: React.ChangeEvent<HTMLInputElement>) =>
    setRuleWithIndex({
      ...rule,
      noEvent: change.target.checked,
    });
  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRuleWithIndex({
      ...rule,
      title: event.target.value,
    });
  };
  const onDelete = () => deleteRule(index);

  return (
    <TableRow
      key={rule.id}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell component="th" scope="row">
        <TextField
          variant="standard"
          size="small"
          label="Name"
          value={rule.match}
          onChange={onChangeMatch}
        />
      </TableCell>
      <TableCell>
        <TextField
          variant="standard"
          size="small"
          label="Title"
          value={rule.title}
          onChange={onChangeTitle}
        />
      </TableCell>
      <TableCell>
        <TimePicker
          label="Start"
          value={rule.startTime}
          onChange={onChangeStartTime}
        />
      </TableCell>
      <TableCell>
        <TimePicker
          label="End"
          value={rule.endTime}
          onChange={onChangeEndTime}
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Checkbox checked={rule.endsNextDay} onChange={onChangeAddDay} />
          }
          label="Overnight"
        />
      </TableCell>
      <TableCell>
        <FormControlLabel
          control={
            <Checkbox checked={rule.noEvent} onChange={onChangeNoEvent} />
          }
          label="Off"
        />
      </TableCell>
      <TableCell>
        <DeleteButton onClick={onDelete} />
      </TableCell>
    </TableRow>
  );
}

function ConfigureRules({
  rules,
  setRules,
}: {
  readonly rules: Rule[];
  readonly setRules: (rules: Rule[]) => void;
}) {
  const setRule = (rule: Rule, index: number) => {
    const newRules = [...rules];
    newRules[index] = rule;

    localStorage.setItem(
      LOCAL_STORAGE_KEYS.lastDataUploadSettings,
      JSON.stringify(rules),
    );
    setRules(newRules);
  };
  const deleteRule = (index: number) => {
    // remove one item from index
    console.log(index);
    console.log(rules);
    const newRules = [...rules];
    newRules.splice(index, 1);
    console.log(newRules);
    setRules(newRules);
  };
  const addRule = () => {
    const newRules = [
      ...rules,
      {
        id: newId(),
        match: "",
        startTime: dayjs().local().startOf("day").hour(8).minute(0).second(0),
        endTime: dayjs().local().startOf("day").hour(17).minute(0).second(0),
        endsNextDay: false,
        noEvent: false,
        title: "",
      },
    ];
    setRules(newRules);
  };
  const rows = rules.map((rule, index) => {
    return (
      <ConfigureRule
        key={rule.id}
        rule={rule}
        index={index}
        setRule={setRule}
        deleteRule={deleteRule}
      />
    );
  });

  return (
    <>
      <Grid container spacing={2}>
        <Panel>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Match</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Start</TableCell>
                  <TableCell>End</TableCell>
                  <TableCell>Overnight</TableCell>
                  <TableCell>Off/Skip</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </TableContainer>
          <AddButton onClick={addRule} />
        </Panel>
      </Grid>
    </>
  );
}

function getStateJson(key: string): object | null {
  const itemJson = localStorage.getItem(key);
  return itemJson ? JSON.parse(itemJson) : null;
}

export default function Upload() {
  const defaultCalendar = getStateJson(
    LOCAL_STORAGE_KEYS.lastSelectedCalendar,
  ) as Calendar | null;
  const [calendar, setCalendar] = useState<Calendar | null>(defaultCalendar);
  const [startDate, setStartDate] = useState<Dayjs>(
    dayjs().local().startOf("day"),
  );

  const defaultRotaInput = getStateJson(LOCAL_STORAGE_KEYS.lastRotaInput) as
    | string[]
    | null;
  const [rotaInput, setRotaInput] = useState<Array<string>>(
    defaultRotaInput ?? [],
  );

  const storedRules = getStateJson(
    LOCAL_STORAGE_KEYS.lastDataUploadSettings,
  ) as StoredRule[] | null;
  const defaultRules = storedRules
    ? storedRules.map((rule) => {
        return {
          id: rule.id,
          match: rule.match,
          startTime: dayjs(rule.startTime),
          endTime: dayjs(rule.endTime),
          endsNextDay: rule.endsNextDay,
          noEvent: rule.noEvent,
          title: rule.title || "",
        };
      })
    : [];
  const [rules, setRules] = useState<Array<Rule>>(defaultRules);

  const timezone = dayjs.tz.guess();
  const rulesByCanonical = Object.fromEntries(
    rules.map((rule) => [canonicalize(rule.match), rule]),
  );

  const rows: Array<Shift> = rotaInput
    .map((rawRow, index) => {
      return parseRow(startDate, index, rawRow, timezone, rulesByCanonical);
    })
    .filter(isShift);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item md={3} xs={12}>
          <Panel>
            <CalendarPicker value={calendar} onChange={setCalendar} />
            <StartPicker value={startDate} onChange={setStartDate} />
            <RotaInput entries={rotaInput} onChange={setRotaInput} />
          </Panel>
        </Grid>
        <Grid item md={9} xs={12}>
          <Panel>
            {calendar !== null && rows.length > 0 ? (
              <>
                <ConfigureRules rules={rules} setRules={setRules} />
                <PreviewAndUpload
                  startDate={startDate}
                  calendar={calendar}
                  rows={rows}
                />
              </>
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
