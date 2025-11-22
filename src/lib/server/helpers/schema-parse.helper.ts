import { ERROR_MESSAGES } from "@/lib/constants";
import { ActionResult } from "@/lib/types/action.types";
import { z } from "zod";

export function parseServerSchema<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
  failureMessage: string = ERROR_MESSAGES.SERVER_RESPONSE.FORM_FIELDS_ERRORS,
): { ok: true; data: z.infer<TSchema> } | { ok: false; result: ActionResult } {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return { ok: false, result: { ok: false, message: failureMessage } };
  }

  return { ok: true, data: parsed.data };
}
