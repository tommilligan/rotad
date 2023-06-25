import { useQuery, UseQueryResult } from "@tanstack/react-query";
import useGoogleClient from "src/hooks/useGoogleClient";
import { GoogleClient } from "src/google-client";
import { Dayjs } from "dayjs";
import { toRFC3339 } from "src/utils";
import { Event } from "src/types";

export default function useEventList(
  calendarId: string,
  timeMin: Dayjs
): UseQueryResult<{ items: Array<Event> }, Error> {
  const googleClient = useGoogleClient();

  return useQuery({
    queryKey: ["getEventList"],
    queryFn: () => getEventList(googleClient, calendarId, timeMin),
  });
}

async function getEventList(
  googleClient: GoogleClient,
  calendarId: string,
  timeMin: Dayjs
): Promise<Array<any>> {
  return googleClient
    .get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${encodeURIComponent(
        toRFC3339(timeMin)
      )}&maxResults=366`
    )
    .json();
}
