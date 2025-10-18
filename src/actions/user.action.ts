"use server";

import { ERROR_MESSAGES } from "@/lib/constants/error.messages";
import prisma from "@/lib/prisma";
import { isNotEmpty, isNullable } from "@/lib/utils/type-guards.utils";
import {
  auth,
  clerkClient,
  currentUser,
  type EmailAddress,
} from "@clerk/nextjs/server";

// TODO: Add Parallel Routes at some point.

// TODO: Add a global error handler that captures thrown errors and shows a toast by default.

export async function createUser() {
  const { userId } = await auth();
  const authUser = await currentUser();

  if (isNullable(userId)) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHENTICATED);
  }

  if (isNullable(authUser)) {
    throw new Error(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
  }

  const primaryEmail = authUser.emailAddresses[0];

  if (!isNotEmpty<EmailAddress>(primaryEmail)) {
    throw new Error(ERROR_MESSAGES.AUTH.EMAIL_NOT_FOUND);
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (existingUser) {
      return existingUser;
    }

    return await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${authUser.firstName ?? ""} ${authUser.lastName ?? ""}`.trim(),
        username: authUser.username ?? primaryEmail.emailAddress.split("@")[0],
        email: primaryEmail.emailAddress,
        image: authUser.imageUrl,
      },
    });
  } catch (error) {
    throw new Error(ERROR_MESSAGES.USER.CREATE_FAILED, { cause: error });
  }
}

export async function completeUserOnboarding() {
  const { userId, sessionId } = await auth();

  if (isNullable(userId) || isNullable(sessionId)) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHENTICATED);
  }

  try {
    const client = await clerkClient();
    const [updatedUser] = await Promise.all([
      client.users.updateUser(userId, {
        publicMetadata: {
          onboardingComplete: true,
        },
      }),
    ]);

    return { message: updatedUser.publicMetadata };
  } catch (error) {
    throw new Error(ERROR_MESSAGES.USER.UPDATE_METADATA_FAILED, {
      cause: error,
    });
  }
}

export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: {
      clerkId,
    },
    include: {
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
}
