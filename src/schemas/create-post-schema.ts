import { REGEX } from "@/lib/constants";
import { stringSchema } from "@/lib/validations";
import { idSchema } from "@/lib/validations/id";
import { z } from "zod";

export type CreatePostSchemaType = z.infer<typeof createPostSchema>;

export const createPostSchema = z.object({
  content: stringSchema({ isRequired: true }),
  imageUrl: idSchema({ regex: REGEX.OPTIONAL_URL }),
});
