"use server";

import prisma from "@/lib/prisma";
import { getAuthenticatedUser, mapPrismaError } from "@/lib/server/helpers";
import { ActionResult } from "@/lib/types/action.types";
import {
  createPostSchema,
  CreatePostSchemaType,
} from "@/schemas/create-post-schema";
import { cacheTag, updateTag } from "next/cache";

// TODO: IMPORTANT! Introduce a global server action error handler (logging, mapping, fallback strategy) and plug all actions into it.

// TODO: IMPORTANT! Hook up react-hook-form for client-side validation and pair it with useActionState-driven server validation flow.
export interface CreatePostRequest extends Record<string, unknown> {
  content: string;
  imageUrl: string;
}

// TODO: Include prepareRequestToSend? - Think about it.
export async function createPost(
  data: CreatePostSchemaType,
): Promise<ActionResult> {
  const { isUserAuthenticated, user } = await getAuthenticatedUser();

  if (!isUserAuthenticated) {
    return { ok: false, message: "You must be signed in." };
  }

  const parsed = createPostSchema.safeParse(data);
  if (!parsed.success) {
    // TODO: Extract general notification schemas (copy).
    return { ok: false, message: "Fix the form fields and try again." };
  }

  const { content, imageUrl } = parsed.data;

  try {
    await prisma.post.create({
      data: { content, image: imageUrl, authorId: user.id },
    });
  } catch (error) {
    // TODO: Extract this entire try/catch into a utility.
    console.error("Database error:", error);

    const { errorCode, message } = mapPrismaError(error);
    const errorId =
      typeof crypto?.randomUUID === "function"
        ? crypto.randomUUID()
        : undefined;

    return { ok: false, message, errorCode, errorId };
  }

  // TODO: add updating multiple tags - ex. also for user info.
  updateTag("posts");
  // TODO: Add router.refresh() or router.redirect in the caller when ok is true.
  return { ok: true, message: "Post created successfully." };
  // TODO: Add global action message handling with a toast, allowing selective overrides per case.
}

export type GetPostsResponse = Awaited<ReturnType<typeof getPosts>>;

// TODO: Fix other functions as createPost.
// TODO: Add pagination and revalidate way of caching.
export async function getPosts() {
  "use cache";
  cacheTag("posts");

  return await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: {
          name: true,
          image: true,
          username: true,
        },
      },
      comments: {
        include: {
          author: {
            select: {
              id: true,
              username: true,
              image: true,
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      },
      likes: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
}
