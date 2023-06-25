import useStore from "src/hooks/useStore";

interface TokenResponse {
  access_token?: string;
  error?: string;
}

export default function useTokenClient() {
  const store = useStore();
  const client = google.accounts.oauth2.initTokenClient({
    client_id:
      "94783838569-lju85dpld8gc66ucdk9db83nrplrjo8v.apps.googleusercontent.com",
    scope: [
      "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
      "https://www.googleapis.com/auth/calendar.calendars.readonly",
      "https://www.googleapis.com/auth/calendar.events",
    ].join(" "),
    callback: (response: TokenResponse) => {
      if (response.access_token) {
        store.setAuthToken(response.access_token);
      } else {
        console.error("Error getting token:", response);
      }
    },
  });
  return client;
}
