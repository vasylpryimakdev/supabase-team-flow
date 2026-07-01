import { normalizeError } from "./normalizeError";
import { useToastStore } from "../../stores/toast.store";

export function handleError(error: unknown) {
  const appError = normalizeError(error);

  useToastStore.getState().showToast(appError.message, "error");

  console.error(appError);
}
