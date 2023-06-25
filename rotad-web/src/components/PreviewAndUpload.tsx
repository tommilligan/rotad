import { Dayjs } from "dayjs";
import { Calendar } from "src/components/CalendarPicker";
import DataLossWarning from "src/components/DataLossWarning";
import Preview, { Data } from "src/components/Preview";
import useEventsList from "src/hooks/useEventsList";
import { useCallback } from "react";

interface PreviewAndUploadProps {
  startDate: Dayjs;
  calendar: Calendar;
  rows: Array<Data>;
}

export default function PreviewAndUpload({
  startDate,
  calendar,
  rows,
}: PreviewAndUploadProps) {
  const eventsList = useEventsList(calendar.id, startDate);
  console.log(eventsList);

  const upload = useCallback(() => {}, []);

  return (
    <>
      {eventsList.isSuccess && eventsList.data.items.length > 0 ? (
        <DataLossWarning
          startDate={startDate}
          calendar={calendar}
          deleteCount={eventsList.data.items.length}
        />
      ) : null}

      <Preview rows={rows} />
    </>
  );
}
