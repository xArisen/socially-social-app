import type { GetAuthenticatedUserResult } from "@/lib/server/helpers/authentication.helper";

export type NavbarMobileButtonsProps = {
  authenticatedUser: GetAuthenticatedUserResult;
};
