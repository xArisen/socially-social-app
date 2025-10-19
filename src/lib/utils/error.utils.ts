import { isNullable } from "./type-guards.utils";

export function getErrorMessage(
  error: unknown,
  fallbackMessage = "Something went wrong.",
): string {
  if (isNullable(error)) {
    return fallbackMessage;
  }

  if (typeof error === "string") {
    const trimmed = error.trim();
    return trimmed.length > 0 ? trimmed : fallbackMessage;
  }

  if (error instanceof Error) {
    const trimmed = error.message.trim();
    return trimmed.length > 0 ? trimmed : fallbackMessage;
  }

  if (
    typeof error === "object" &&
    "message" in (error as Record<string, unknown>)
  ) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === "string") {
      const trimmed = message.trim();
      return trimmed.length > 0 ? trimmed : fallbackMessage;
    }
  }

  return fallbackMessage;
}
