import type { GetAuthenticatedUserResult } from "@/lib/server/helpers/authentication.helper";

export interface CreatePostProps {
  user: NonNullable<GetAuthenticatedUserResult["user"]>;
}
