import { create, StoreApi, UseBoundStore } from "zustand";

interface Store {
  authToken: string | null;
  setAuthToken: (authToken: string) => void;
}

const useStore: UseBoundStore<StoreApi<Store>> = create(
  (set): Store => ({
    authToken: null,
    setAuthToken: (authToken: string) => set(() => ({ authToken })),
  })
);
export default useStore;
