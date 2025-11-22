import { ERROR_MESSAGES } from "@/lib/constants";
import { ActionResult } from "@/lib/types/action.types";
import { mapPrismaError } from "./database-error.helper";

interface RunActionWithDbHandlingOptions {
  fallbackMessage?: string;
}

export async function runActionWithDbHandling(
  action: () => Promise<unknown>,
  options: RunActionWithDbHandlingOptions = {}
): Promise<ActionResult> {
  try {
    await action();
    return { ok: true };
  } catch (error) {
    console.error(ERROR_MESSAGES.SERVER_RESPONSE.DATABASE_CONSOLE_ERROR, error);

    const { errorCode, message } = mapPrismaError(error);
    const errorId =
      typeof crypto?.randomUUID === "function"
        ? crypto.randomUUID()
        : undefined;

    return {
      ok: false,
      message: options.fallbackMessage ?? message,
      errorCode,
      errorId,
    };
  }
}
