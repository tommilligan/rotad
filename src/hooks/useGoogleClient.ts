import { newWithToken } from "src/google-client";
import useStore from "src/hooks/useStore";

export default function useGoogleClient() {
  const store = useStore();
  const authToken = store.authToken || "";
  return newWithToken(authToken);
}
