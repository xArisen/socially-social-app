import { ERROR_MESSAGES } from "@/lib/constants/error.messages";
import { ActionResult, ActionSuccess } from "@/lib/types/action.types";
import { isNotNullable } from "@/lib/utils/type-guards.utils";
import { mapPrismaError } from "./database-error.helper";

interface RunActionWithDbHandlingOptions {
  fallbackMessage?: string;
}

export async function runActionWithDbHandling<TResult = void>(
  action: () => Promise<TResult>,
  options: RunActionWithDbHandlingOptions = {},
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
    const finalMessage =
      options.fallbackMessage ??
      message ??
      ERROR_MESSAGES.SERVER_RESPONSE.SERVER_ACTION_FAILED("database action");

    const dbError = new Error(finalMessage, { cause: error });
    (dbError as Error & { code?: string }).code = errorCode;

    throw dbError;
  }
}
