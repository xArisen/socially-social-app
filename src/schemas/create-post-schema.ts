import { stringSchema } from "@/lib/validations";
import { z } from "zod";

// TODO: IMPORTANT! Extract stringSchema, numberSchema, etc.
// TODO: fix sample validation
export const createPostSchema = z.object({
  content: stringSchema(),
  // TODO: fix imageUrl validation
  imageUrl: z
    .string()
    .url("Invalid URL.")
    .or(z.literal("").transform(() => undefined))
    .optional(),
});

export type CreatePostSchemaType = z.infer<typeof createPostSchema>;
