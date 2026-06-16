import { REGEX } from "@/lib/constants/regex";
import { idSchema } from "@/lib/validations/id/id-schema";
import { stringSchema } from "@/lib/validations/string/string-schema";
import { z } from "zod";

export type CreatePostSchemaType = z.infer<typeof createPostSchema>;

export const createPostSchema = z.object({
  content: stringSchema({ isRequired: true }),
  imageUrl: idSchema({ regex: REGEX.OPTIONAL_URL, isRequired: true }),
});
