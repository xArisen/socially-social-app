import { GetAuthenticatedUserResult } from "@/lib/server/helpers";

export interface CreatePostProps {
  user: NonNullable<GetAuthenticatedUserResult["user"]>;
}
