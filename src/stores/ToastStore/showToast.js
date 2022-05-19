// @ts-nocheck
import { toasts } from "./stores";
import { v4 as uuidv4 } from "uuid";

export default function showToast(message, type, options) {
  toasts.update((toasts) => [
    ...toasts,
    { id: uuidv4(), message, type, options },
  ]);
}
