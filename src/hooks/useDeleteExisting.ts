import {
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import useGoogleClient from "src/hooks/useGoogleClient";
import { sleep } from "src/utils";
import { GoogleClient } from "src/google-client";

export default function useDeleteExisting(
  calendarId: string,
  eventIds: Array<string>
): [UseMutationResult<unknown, unknown, void>, () => void] {
  const googleClient = useGoogleClient();

  const setDeleteExisting = useMutation(async () => {
    return Promise.all(
      eventIds.map(async (eventId, index) => {
        await sleep(2.0 * index);
        return deleteEvent(googleClient, calendarId, eventId);
      })
    );
  });

  return [setDeleteExisting, () => setDeleteExisting.mutate()];
}

async function deleteEvent(
  googleClient: GoogleClient,
  calendarId: string,
  eventId: string
): Promise<void> {
  return googleClient.delete(
    `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${eventId}`
  );
}
