import { Dayjs } from "dayjs";
import { Calendar } from "src/components/CalendarPicker";
import DataLossWarning from "src/components/DataLossWarning";
import Preview, { Data } from "src/components/Preview";
import useEventsList from "src/hooks/useEventsList";
import useCreateNew from "src/hooks/useCreateNew";
import { useCallback } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

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
  // const deleteExisting = useDeleteExisting();
  const [createNew, setCreateNew] = useCreateNew(calendar.id, rows);
  console.log(eventsList);

  const deleteAndUpload = useCallback(() => {
    if (eventsList.isSuccess) {
      // deleteExisting(eventsList.data.items);
    }

    setCreateNew();
  }, []);

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
      <LoadingButton
        color="primary"
        size="medium"
        onClick={deleteAndUpload}
        loading={createNew.isLoading}
      >
        Upload
      </LoadingButton>
    </>
  );
}
