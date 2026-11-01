import { create, StoreApi, UseBoundStore } from "zustand";

interface Store {
  authToken: string | null;
  /** Epoch milliseconds after which `authToken` should no longer be used. */
  authTokenExpiresAt: number | null;
  authError: string | null;
  setAuthToken: (authToken: string, expiresAt: number) => void;
  clearAuthToken: () => void;
  setAuthError: (authError: string | null) => void;
}

const useStore: UseBoundStore<StoreApi<Store>> = create((set): Store => ({
  authToken: null,
  authTokenExpiresAt: null,
  authError: null,
  setAuthToken: (authToken: string, expiresAt: number) =>
    set(() => {
      return { authToken, authTokenExpiresAt: expiresAt };
    }),
  clearAuthToken: () =>
    set(() => {
      return { authToken: null, authTokenExpiresAt: null };
    }),
  setAuthError: (authError: string | null) =>
    set(() => {
      return { authError };
    }),
}));
export default useStore;
