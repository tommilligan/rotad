import { useQuery, UseQueryResult } from "@tanstack/react-query";
import useGoogleClient from "src/hooks/useGoogleClient";
import { KyInstance } from "ky";
import { Dayjs } from "dayjs";

export default function useEventList(
  calendarId: string,
  timeMin: Dayjs
): UseQueryResult<Array<any>, Error> {
  const googleClient = useGoogleClient();

  return useQuery({
    queryKey: ["getEventList"],
    queryFn: () => getEventList(googleClient, calendarId, timeMin),
  });
}

async function getEventList(
  googleClient: KyInstance,
  calendarId: string,
  timeMin: Dayjs
): Promise<Array<any>> {
  return googleClient
    .get(
      `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?timeMin=${timeMin.toISOString()}&maxResults=366`
    )
    .json();
}
