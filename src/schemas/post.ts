import { z } from "zod";

// TODO: IMPORTANT! Extract stringSchema, numberSchema, etc.
// TODO: fix sample validation
export const createPostSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "Post cannot be empty.")
    .max(280, "Maximum 280 characters."),
  imageUrl: z
    .string()
    .url("Invalid URL.")
    .or(z.literal("").transform(() => undefined))
    .optional(),
});

export type CreatePostSchemaType = z.infer<typeof createPostSchema>;
