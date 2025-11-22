"use server";

import { ERROR_MESSAGES } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser, mapPrismaError } from "@/lib/server/helpers";
import { ActionResult } from "@/lib/types/action.types";
import { prepareRequestToSend } from "@/lib/utils";
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

export async function createPost(
  data: CreatePostSchemaType
): Promise<ActionResult> {
  const { isUserAuthenticated, user } = await getAuthenticatedUser();

  if (!isUserAuthenticated) {
    return { ok: false, message: ERROR_MESSAGES.AUTH.UNAUTHENTICATED };
  }

  const parsed = createPostSchema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      message: ERROR_MESSAGES.SERVER_RESPONSE.FORM_FIELDS_ERRORS,
    };
  }

  const preparedData = prepareRequestToSend(parsed.data);

  try {
    await prisma.post.create({
      data: {
        content: preparedData.content,
        image: preparedData.imageUrl,
        authorId: user.id,
      },
    });
  } catch (error) {
    // TODO: Extract this entire try/catch into a utility.
    console.error(ERROR_MESSAGES.SERVER_RESPONSE.DATABASE_ERROR, error);

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
  return { ok: true, message: ERROR_MESSAGES.POST.CREATE_SUCCESS };
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
