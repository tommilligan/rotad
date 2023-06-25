import { create, StoreApi, UseBoundStore } from "zustand";
import { LOCAL_STORAGE_KEYS } from "src/constants";

interface Store {
  authToken: string | null;
  setAuthToken: (authToken: string) => void;
}

const useStore: UseBoundStore<StoreApi<Store>> = create(
  (set): Store => ({
    authToken: null,
    setAuthToken: (authToken: string) =>
      set(() => {
        localStorage.setItem(LOCAL_STORAGE_KEYS.accessToken, authToken);
        return { authToken };
      }),
  })
);
export default useStore;
