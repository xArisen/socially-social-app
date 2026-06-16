"use server";

import { paths } from "@/lib/constants/paths";
import { ERROR_MESSAGES } from "@/lib/constants/error.messages";
import prisma from "@/lib/prisma";
import { getAuthenticatedUser } from "@/lib/server/helpers/authentication.helper";
import { prepareRequestToSend } from "@/lib/utils/request.utils";
import { isNotEmpty, isNullable } from "@/lib/utils/type-guards.utils";
import {
  auth,
  clerkClient,
  currentUser,
  EmailAddress,
} from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// TODO: Add Parallel Routes at some point.

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

export interface GetUserByClerkIdRequest extends Record<string, unknown> {
  clerkId: string;
}

export async function getUserByClerkId(request: GetUserByClerkIdRequest) {
  const { clerkId } = prepareRequestToSend(request);

  return prisma.user.findUnique({
    where: {
      clerkId: clerkId,
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

export async function getRecommendedUsers() {
  const { isUserAuthenticated, user } = await getAuthenticatedUser();

  if (!isUserAuthenticated) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHENTICATED);
  }

  try {
    return await prisma.user.findMany({
      where: {
        AND: [
          { NOT: { id: user.id } },
          {
            NOT: {
              followers: {
                some: {
                  followerId: user.id,
                },
              },
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        _count: {
          select: {
            followers: true,
          },
        },
      },
      take: 3,
    });
  } catch (error) {
    throw new Error(ERROR_MESSAGES.USER.RECOMMENDATIONS_FAILED, {
      cause: error,
    });
  }
}

export type GetRecommendedUsersResponse = Awaited<
  ReturnType<typeof getRecommendedUsers>
>;

async function followUser(targetUserId: string, currentUserId: string) {
  try {
    const [followRecord] = await prisma.$transaction([
      prisma.follows.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      }),
      prisma.notification.create({
        data: {
          type: "FOLLOW",
          userId: targetUserId,
          creatorId: currentUserId,
        },
      }),
    ]);

    return followRecord;
  } catch (error) {
    throw new Error(ERROR_MESSAGES.USER.FOLLOW_FAILED, { cause: error });
  }
}

async function unFollowUser(targetUserId: string, currentUserId: string) {
  try {
    return await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });
  } catch (error) {
    throw new Error(ERROR_MESSAGES.USER.UNFOLLOW_FAILED, { cause: error });
  }
}

export interface ToggleFollowRequest extends Record<string, unknown> {
  targetUserId: string;
}

export async function toggleFollow(request: ToggleFollowRequest) {
  const { isUserAuthenticated, user: currentUser } =
    await getAuthenticatedUser();

  if (!isUserAuthenticated) {
    throw new Error(ERROR_MESSAGES.AUTH.UNAUTHENTICATED);
  }

  const { targetUserId } = prepareRequestToSend(request);

  if (targetUserId === currentUser.id) {
    throw new Error(ERROR_MESSAGES.USER.FOLLOW_SELF_FORBIDDEN);
  }

  const existingFollow = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUser.id,
        followingId: targetUserId,
      },
    },
  });

  if (existingFollow) {
    try {
      await unFollowUser(targetUserId, currentUser.id);
      revalidatePath(paths.HOME);
      return { status: "unfollowed" } as const;
    } catch (error) {
      throw new Error(ERROR_MESSAGES.USER.TOGGLE_FOLLOW_FAILED, {
        cause: error,
      });
    }
  }

  try {
    await followUser(targetUserId, currentUser.id);
    revalidatePath(paths.HOME);
    return { status: "followed" } as const;
  } catch (error) {
    throw new Error(ERROR_MESSAGES.USER.TOGGLE_FOLLOW_FAILED, {
      cause: error,
    });
  }
}
