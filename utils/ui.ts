import toast from "react-hot-toast";
import get from "lodash/get";
import axios, { AxiosError } from "axios";

export const DEFAULT_ERROR_MESSAGE =
  "if this persists please notify the GlassNotes team";

export function getErrorMessage(err: AxiosError | Error) {
  let message;

  if (axios.isAxiosError(err)) {
    const status = get(err, "response.status", 500);
    if (status !== 500) {
      message = get(err, "response.data.error.message");
    }
  }

  return message || DEFAULT_ERROR_MESSAGE;
}

export const notifySuccess = (message: string) => toast.success(message);

export const notifyError = (message: string) => toast.error(message);
