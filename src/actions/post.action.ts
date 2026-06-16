"use server";

import { ERROR_MESSAGES } from "@/lib/constants/error.messages";
import prisma from "@/lib/prisma";
import { runActionWithDbHandling } from "@/lib/server/helpers/action-error.helper";
import { getAuthenticatedUser } from "@/lib/server/helpers/authentication.helper";
import { parseServerSchema } from "@/lib/server/helpers/schema-parse.helper";
import { ActionResult } from "@/lib/types/action.types";
import { prepareRequestToSend } from "@/lib/utils/request.utils";
import {
  createPostSchema,
  type CreatePostSchemaType,
} from "@/schemas/create-post-schema";
import { cacheTag, updateTag } from "next/cache";

// TODO: IMPORTANT! Introduce a global server action error handler (logging, mapping, fallback strategy) and plug all actions into it.

export interface CreatePostRequest extends Record<string, unknown> {
  content: string;
  imageUrl: string;
}

export interface CreatePostResponse {
  postId: string;
}

export async function createPost(
  data: CreatePostSchemaType
): Promise<ActionResult<CreatePostResponse>> {
  const { isUserAuthenticated, user } = await getAuthenticatedUser();

  if (!isUserAuthenticated) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHENTICATED);
  }

  const preparedData = prepareRequestToSend(
    parseServerSchema(createPostSchema, data)
  );

  const creationResult = await runActionWithDbHandling(
    async () => {
      const post = await prisma.post.create({
        data: {
          content: preparedData.content,
          image: preparedData.imageUrl,
          authorId: user.id,
        },
        select: { id: true },
      });

      return { postId: post.id };
    },
    {
      fallbackMessage:
        ERROR_MESSAGES.SERVER_RESPONSE.SERVER_ACTION_FAILED("post creation"),
    }
  );

  // TODO: add updating multiple tags - ex. also for user info.
  updateTag("posts");
  return {
    ok: true,
    message: ERROR_MESSAGES.POST.CREATE_SUCCESS,
    data: creationResult.data,
  };
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
