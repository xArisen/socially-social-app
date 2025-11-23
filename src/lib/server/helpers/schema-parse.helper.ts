import { ERROR_MESSAGES } from "@/lib/constants";
import { z } from "zod";

export function parseServerSchema<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
  failureMessage: string = ERROR_MESSAGES.SERVER_RESPONSE.FORM_FIELDS_ERRORS,
): z.infer<TSchema> {
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    throw new Error(failureMessage);
  }

  return parsed.data;
}
