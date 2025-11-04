"use server";

import type { ActionResult } from "@/lib/client/utils";
import { ERROR_MESSAGES, paths } from "@/lib/constants";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server/helpers";
import { prepareRequestToSend } from "@/lib/utils";
import { createPostSchema, type CreatePostSchemaType } from "@/schemas/post";
import { revalidatePath } from "next/cache";

// TODO: IMPORTANT! Introduce a global server action error handler (logging, mapping, fallback strategy) and plug all actions into it.

// TODO: IMPORTANT! Hook up react-hook-form for client-side validation and pair it with useActionState-driven server validation flow.
export interface CreatePostRequest extends Record<string, unknown> {
  content: string;
  imageUrl: string;
}

export async function createPost(
  data: CreatePostSchemaType
): Promise<ActionResult<keyof CreatePostSchemaType>> {
  const { isUserAuthenticated } = await getAuthenticatedUser();

  if (!isUserAuthenticated) {
    return { ok: false, message: "You must be signed in." };
  }

  const parsed = createPostSchema.safeParse(data);
  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten(
      (issue) => issue.message ?? ERROR_MESSAGES.MESSAGE_LACKING,
  );
    const firstNonEmpty = (messages?: string[]) =>
      messages?.find((message) => message.trim().length > 0);

    return {
      ok: false,
      message: "Please correct the highlighted fields.",
      fieldErrors: {
        content: firstNonEmpty(fieldErrors.content),
        imageUrl: firstNonEmpty(fieldErrors.imageUrl),
      },
    };
  }

  const { content, imageUrl } = parsed.data;

  try {
    await prisma.post.create({
      data: { content, image: imageUrl, authorId: userId },
    });
  } catch {
    return {
      ok: false,
      message: "Failed to create the post. Please try again.",
    };
  }

  // Trigger cache invalidation for the post list.
  revalidatePath("/posts");
  return { ok: true, message: "Post created successfully." };

  // Alternative (PRG): finish the flow hard-stop:
  // redirect("/posts?success=1");
}

export async function createPost(request: CreatePostRequest) {
  const { isUserAuthenticated, user } = await getAuthenticatedUser();

  if (!isUserAuthenticated) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHENTICATED);
  }

  const { imageUrl, ...restRequest } = request;

  const payload = prepareRequestToSend({ ...restRequest, image: imageUrl });

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
