import { useMutation, UseMutationResult } from "@tanstack/react-query";
import useGoogleClient from "src/hooks/useGoogleClient";
import { GoogleClient } from "src/google-client";
import { sleep, toRFC3339 } from "src/utils";
import { Shift } from "src/types";

export default function useCreateNew(
  calendarId: string,
  rows: Array<Shift>
): [UseMutationResult<unknown, unknown, void>, () => void] {
  const googleClient = useGoogleClient();

  const setCreateNew = useMutation(async () => {
    return Promise.all(
      rows.map(async (row, index) => {
        await sleep(0.4 * index);
        return createEvent(googleClient, calendarId, row);
      })
    );
  });

  return [setCreateNew, () => setCreateNew.mutate()];
}

async function createEvent(
  googleClient: GoogleClient,
  calendarId: string,
  row: Shift
): Promise<void> {
  return googleClient.post(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
    {
      json: {
        start: { dateTime: toRFC3339(row.start) },
        end: { dateTime: toRFC3339(row.end) },
        summary: row.title,
      },
    }
  );
}
