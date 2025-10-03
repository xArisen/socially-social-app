"use server";

import prisma from "@/lib/prisma";
import { isNullable } from "@/lib/utils/type-guards.utils";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";

// TODO: Add global function which collect throwed error and by deafaul shows toast with message.

export async function createUser() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (isNullable(user) || isNullable(userId)) {
      // TODO: throw error
      return;
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        clerkId: userId,
      },
    });

    if (existingUser) {
      return existingUser;
    }

    const dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
        username:
          user.username ?? user.emailAddresses[0].emailAddress.split("@")[0],
        email: user.emailAddresses[0].emailAddress,
        image: user.imageUrl,
      },
    });

    return dbUser;
  } catch (error) {
    // TODO: throw error
  }
}

export async function updateUser() {
  const { userId } = await auth();
  const client = await clerkClient();

  if (isNullable(userId)) {
    // TODO: throw error
    return;
  }

  try {
    const res = await client.users.updateUser(userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    });

    return { message: res.publicMetadata };
  } catch (err) {
    return { error: "There was an error updating the user metadata." };
  }
}
