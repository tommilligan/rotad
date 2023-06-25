import { useQuery, UseQueryResult } from "@tanstack/react-query";
import useGoogleClient from "src/hooks/useGoogleClient";
import { KyInstance } from "ky";

/**
 * Return the current logged in users calendars.
 *
 * Will fail if no user is credentialed.
 */
export default function useCalendarList(): UseQueryResult<Array<any>, Error> {
  const googleClient = useGoogleClient();

  return useQuery({
    queryKey: ["getCalendarList"],
    queryFn: () => getCalendarList(googleClient),
  });
}

async function getCalendarList(googleClient: KyInstance): Promise<Array<any>> {
  return googleClient
    .get("https://www.googleapis.com/calendar/v3/users/me/calendarList")
    .json();
}
