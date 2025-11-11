import { Button } from "@/components/ui/button/button";
import { paths } from "@/lib/constants";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { BellIcon, HomeIcon, LogOutIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import type { NavbarMobileButtonsProps } from "./navbar-mobile-buttons.types";

export function NavbarMobileButtons(props: NavbarMobileButtonsProps) {
  const { authenticatedUser } = props;
  return (
    <>
      <Button
        variant="ghost"
        className="flex items-center gap-3 justify-start"
        asChild
      >
        <Link href={paths.HOME}>
          <HomeIcon className="w-4 h-4" />
          Home
        </Link>
      </Button>

      {authenticatedUser.isUserAuthenticated ? (
        <>
          <Button
            variant="ghost"
            className="flex items-center gap-3 justify-start"
            asChild
          >
            <Link href={paths.NOTIFICATIONS}>
              <BellIcon className="w-4 h-4" />
              Notifications
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="flex items-center gap-3 justify-start"
            asChild
          >
            <Link href={paths.PROFILE(authenticatedUser.user.id)}>
              <UserIcon className="w-4 h-4" />
              Profile
            </Link>
          </Button>
          <SignOutButton>
            <Button
              variant="ghost"
              className="flex items-center gap-3 justify-start w-full"
            >
              <LogOutIcon className="w-4 h-4" />
              Logout
            </Button>
          </SignOutButton>
        </>
      ) : (
        // TODO: Move the Clerk modal trigger into an @loginModal slot so this button just navigates there.
        <SignInButton mode="modal">
          <Button variant="default" className="w-full">
            Sign In
          </Button>
        </SignInButton>
      )}
    </>
  );
}
