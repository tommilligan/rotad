import { Dayjs } from "dayjs";
import { Calendar } from "src/types";
import DataLossWarning from "src/components/DataLossWarning";
import Preview from "src/components/Preview";
import { Shift } from "src/types";
import useEventsList from "src/hooks/useEventsList";
import useCreateNew from "src/hooks/useCreateNew";
import useDeleteExisting from "src/hooks/useDeleteExisting";
import { useCallback } from "react";
import LoadingButton from "@mui/lab/LoadingButton";

interface PreviewAndUploadProps {
  startDate: Dayjs;
  calendar: Calendar;
  rows: Array<Shift>;
}

export default function PreviewAndUpload({
  startDate,
  calendar,
  rows,
}: PreviewAndUploadProps) {
  const eventsList = useEventsList(calendar.id, startDate);
  const eventIds = eventsList.isSuccess
    ? eventsList.data!.items!.map!((event) => event.id)
    : [];
  const [deleteExisting, setDeleteExisting] = useDeleteExisting(
    calendar.id,
    eventIds
  );
  const [createNew, setCreateNew] = useCreateNew(calendar.id, rows);

  const deleteAndUpload = useCallback(() => {
    setDeleteExisting();
    setCreateNew();
  }, []);

  return (
    <>
      {eventsList.isSuccess && eventsList.data!.items.length > 0 ? (
        <DataLossWarning
          startDate={startDate}
          calendarName={calendar.summary}
          deleteCount={eventsList.data!.items.length}
        />
      ) : null}

      <Preview rows={rows} />
      <LoadingButton
        variant="contained"
        color="primary"
        size="medium"
        onClick={deleteAndUpload}
        loading={deleteExisting.isLoading || createNew.isLoading}
      >
        Upload
      </LoadingButton>
    </>
  );
}
