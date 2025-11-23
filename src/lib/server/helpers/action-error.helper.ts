import { ERROR_MESSAGES } from "@/lib/constants";
import { ActionResult, ActionSuccess } from "@/lib/types/action.types";
import { isNotNullable } from "@/lib/utils";
import { mapPrismaError } from "./database-error.helper";

interface RunActionWithDbHandlingOptions {
  fallbackMessage?: string;
}

export async function runActionWithDbHandling<TResult = void>(
  action: () => Promise<TResult>,
  options: RunActionWithDbHandlingOptions = {}
): Promise<ActionResult<TResult>> {
  try {
    const data = await action();

    if (isNotNullable(data)) {
      return { ok: true, data } as unknown as ActionSuccess<TResult>;
    }

    return { ok: true } as unknown as ActionSuccess<TResult>;
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
