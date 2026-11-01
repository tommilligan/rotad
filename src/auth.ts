import { LOCAL_STORAGE_KEYS, SESSION_STORAGE_KEYS } from "src/constants";

export interface StoredToken {
  accessToken: string;
  /** Epoch milliseconds after which the token should no longer be used. */
  expiresAt: number;
}

// Stop using a token slightly before Google expires it, so we don't fail
// part way through an upload.
const EXPIRY_MARGIN_MS = 60 * 1000;

/**
 * Remember an access token for the lifetime of this browser tab.
 *
 * Returns the time (epoch milliseconds) at which the token should be dropped.
 */
export function saveToken(
  accessToken: string,
  expiresInSeconds: number,
): number {
  const expiresAt = Date.now() + expiresInSeconds * 1000 - EXPIRY_MARGIN_MS;
  const stored: StoredToken = { accessToken, expiresAt };
  sessionStorage.setItem(
    SESSION_STORAGE_KEYS.accessToken,
    JSON.stringify(stored),
  );
  return expiresAt;
}

/**
 * Load the remembered access token, if there is one and it hasn't expired.
 */
export function loadToken(): StoredToken | null {
  // Tokens used to be persisted indefinitely in localStorage. Never read them,
  // and get rid of them.
  localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);

  const json = sessionStorage.getItem(SESSION_STORAGE_KEYS.accessToken);
  if (json === null) {
    return null;
  }

  try {
    const stored = JSON.parse(json);
    if (
      typeof stored.accessToken === "string" &&
      typeof stored.expiresAt === "number" &&
      stored.expiresAt > Date.now()
    ) {
      return stored;
    }
  } catch {
    // Fall through, and discard the unreadable value
  }
  clearToken();
  return null;
}

export function clearToken(): void {
  sessionStorage.removeItem(SESSION_STORAGE_KEYS.accessToken);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.accessToken);
}
