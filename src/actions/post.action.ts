"use server";

import { ERROR_MESSAGES, paths } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server/helpers";
import { prepareRequestToSend } from "@/lib/utils";
import { revalidatePath } from "next/cache";

// TODO: IMPORTANT! Introduce a global server action error handler (logging, mapping, fallback strategy) and plug all actions into it.
export interface CreatePostRequest extends Record<string, unknown> {
  content: string;
  imageUrl: string;
}

export async function createPost(request: CreatePostRequest) {
  const { isUserAuthenticated, user } = await getAuthenticatedUser();

  if (!isUserAuthenticated) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHENTICATED);
  }

  const payload = prepareRequestToSend(request);

  let createdPost = null;

  try {
    createdPost = await prisma.post.create({
      data: {
        ...payload,
        authorId: user.id,
      },
    });
  } catch (error) {
    throw new Error(ERROR_MESSAGES.POST.CREATE_FAILED, { cause: error });
  }

  revalidatePath(paths.HOME);

  return createdPost;
}

export type GetPostsResponse = Awaited<ReturnType<typeof getPosts>>;

export async function getPosts() {
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
