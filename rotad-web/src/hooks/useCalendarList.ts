import { useQuery, UseQueryResult } from "@tanstack/react-query";
import useGoogleClient from "src/hooks/useGoogleClient";
import { GoogleClient } from "src/google-client";
import { Calendar } from "src/types";

/**
 * Return the current logged in users calendars.
 *
 * Will fail if no user is credentialed.
 */
export default function useCalendarList(): UseQueryResult<
  { items: Array<Calendar> },
  Error
> {
  const googleClient = useGoogleClient();

  return useQuery({
    queryKey: ["getCalendarList"],
    queryFn: () => getCalendarList(googleClient),
  });
}

async function getCalendarList(
  googleClient: GoogleClient
): Promise<{ items: Array<Calendar> }> {
  return googleClient
    .get("https://www.googleapis.com/calendar/v3/users/me/calendarList")
    .json();
}
