"use server";

import { ERROR_MESSAGES, paths } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server/helpers";
import type { PreparedRequest } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export interface CreatePostPayload extends Record<string, unknown> {
  content: string;
  imageUrl: string;
}

export type CreatePostRequest = PreparedRequest<CreatePostPayload>;

export async function createPost(request: CreatePostRequest) {
  const { isUserAuthenticated, user } = await getAuthenticatedUser();

  if (!isUserAuthenticated) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHENTICATED);
  }

  let createdPost = null;

  try {
    createdPost = await prisma.post.create({
      data: {
        authorId: user.id,
        content: request.content,
        image: request.imageUrl,
      },
    });
  } catch (error) {
    throw new Error(ERROR_MESSAGES.POST.CREATE_FAILED, { cause: error });
  }

  revalidatePath(paths.HOME);

  return createdPost;
}
