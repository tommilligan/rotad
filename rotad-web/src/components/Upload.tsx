import dayjs, { Dayjs } from "dayjs";
import { LOCAL_STORAGE_KEYS } from "src/constants";
import CalendarPicker, { Calendar } from "src/components/CalendarPicker";
import StartPicker from "src/components/StartPicker";
import RotaInput from "src/components/RotaInput";
import PreviewAndUpload from "src/components/PreviewAndUpload";
import { Data } from "src/components/Preview";
import { useState } from "react";

function parseRow(
  startDate: Dayjs,
  index: number,
  rawRow: string
): Data | null {
  const trimmed = rawRow.trim();
  const base = startDate.add(index, "day");
  let title;
  let start;
  let end;
  switch (trimmed) {
    case "O":
    case "":
      return null;
    case "SDT":
      title = `Self Development Time`;
      start = base.hour(10).minute(0).second(0);
      end = base.hour(16).minute(0).second(0);
      break;
    case "D":
      title = `Day`;
      start = base.hour(8).minute(0).second(0);
      end = base.hour(17).minute(0).second(0);
      break;
    case "LT":
      title = `Late`;
      start = base.hour(14).minute(0).second(0);
      end = base.hour(22).minute(0).second(0);
      break;
    case "N":
      title = `Night`;
      start = base.hour(21).minute(0).second(0);
      end = base.add(1, "day").hour(9).minute(30).second(0);
      break;
    case "L":
      title = `Long`;
      start = base.hour(9).minute(0).second(0);
      end = base.hour(21).minute(15).second(0);
      break;
    default:
      title = `rotad could not parse: ${trimmed}`;
      start = base.hour(10).minute(0).second(0);
      end = base.hour(14).minute(0).second(0);
      break;
  }
  return { title, start, end };
}

export default function Upload() {
  const defaultCalendarJson = localStorage.getItem(
    LOCAL_STORAGE_KEYS.lastSelectedCalendar
  );
  const defaultCalendar = defaultCalendarJson
    ? JSON.parse(defaultCalendarJson)
    : null;

  const [calendar, setCalendar] = useState<Calendar | null>(defaultCalendar);
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().startOf("day"));
  const [rotaInput, setRotaInput] = useState<Array<string>>([]);

  const rows = rotaInput
    .map((rawRow, index) => {
      return parseRow(startDate, index, rawRow);
    })
    .filter((row) => row !== null);

  return (
    <>
      <CalendarPicker value={calendar} onChange={setCalendar} />
      <StartPicker value={startDate} onChange={setStartDate} />
      <RotaInput value={rotaInput} onChange={setRotaInput} />
      {calendar !== null && rows.length > 0 ? (
        <PreviewAndUpload
          startDate={startDate}
          calendar={calendar}
          rows={rows}
        />
      ) : null}
    </>
  );
}
