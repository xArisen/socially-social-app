import { getUserByClerkId } from "@/actions";
import { ERROR_MESSAGES } from "@/lib/constants";
import { currentUser } from "@clerk/nextjs/server";
import { isNullable } from "../../utils/type-guards.utils";

type AuthenticatedUser = NonNullable<
  Awaited<ReturnType<typeof getUserByClerkId>>
>;

export type GetAuthenticatedUserResult =
  | { isUserAuthenticated: false; user: null }
  | { isUserAuthenticated: true; user: AuthenticatedUser };

export async function getAuthenticatedUser(): Promise<GetAuthenticatedUserResult> {
  const authUser = await currentUser();

  if (isNullable(authUser)) {
    return { isUserAuthenticated: false, user: null };
  }

  const user = await getUserByClerkId({ clerkId: authUser.id });
  if (isNullable(user)) {
    throw new Error(ERROR_MESSAGES.USER.NOT_FOUND);
  }

  return { isUserAuthenticated: true, user };
}
