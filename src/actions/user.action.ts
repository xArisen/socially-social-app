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

// TODO: Add a global error handler that captures thrown errors and shows a toast by default.

export async function createUser() {
  const { userId } = await auth();
  const user = await currentUser();

  if (isNullable(userId)) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHENTICATED);
  }

  if (isNullable(user)) {
    throw new Error(ERROR_MESSAGES.AUTH.USER_NOT_FOUND);
  }

  const primaryEmail = user.emailAddresses[0];

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
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        username: user.username ?? primaryEmail.emailAddress.split("@")[0],
        email: primaryEmail.emailAddress,
        image: user.imageUrl,
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
