export const LOCAL_STORAGE_KEYS = {
  // Legacy: access tokens used to be persisted here. Now only used to clear
  // out any token left behind by an older version of the app.
  accessToken: "rotad_access_token",
  lastSelectedCalendar: "rotad_last_selected_calendar",
  lastDataUploadSettings: "rotad_last_data_upload_settings",
  lastRotaInput: "rotad_last_rota_input",
};

export const SESSION_STORAGE_KEYS = {
  accessToken: "rotad_access_token",
};

/**
 * The minimum Google OAuth scopes the app needs.
 *
 * - calendarlist.readonly: list the calendars to choose from
 * - events: list, create and delete events in the chosen calendar
 */
export const GOOGLE_SCOPES = [
  "https://www.googleapis.com/auth/calendar.calendarlist.readonly",
  "https://www.googleapis.com/auth/calendar.events",
];
