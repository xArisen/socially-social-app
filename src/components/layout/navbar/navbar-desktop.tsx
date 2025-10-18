import { ThemeModeToggleButton } from "@/components/theme/theme-mode-toggle-button";
import { Button } from "@/components/ui/button/button";
import { paths } from "@/lib/constants";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import { BellIcon, HomeIcon, UserIcon } from "lucide-react";
import Link from "next/link";

export async function NavbarDesktop() {
  const authUser = await currentUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
      <ThemeModeToggleButton />

      <Button variant="ghost" className="flex items-center gap-2" asChild>
        <Link href={paths.HOME}>
          <HomeIcon className="w-4 h-4" />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>

      {authUser ? (
        <>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link href={paths.NOTIFICATIONS}>
              <BellIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Notifications</span>
            </Link>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2" asChild>
            <Link
              // TODO: fix import address from paths.ts
              href={`/profile/${
                authUser.username ??
                authUser.emailAddresses[0].emailAddress.split("@")[0]
              }`}
            >
              <UserIcon className="w-4 h-4" />
              <span className="hidden lg:inline">Profile</span>
            </Link>
          </Button>
          <UserButton />
        </>
      ) : (
        <SignInButton mode="modal">
          <Button variant="default">Sign In</Button>
        </SignInButton>
      )}
    </div>
  );
}
