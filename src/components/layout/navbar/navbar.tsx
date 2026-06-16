import { paths } from "@/lib/constants/paths";
import { getAuthenticatedUser } from "@/lib/server/helpers/authentication.helper";
import Link from "next/link";
import { NavbarDesktop } from "./navbar-desktop";
import { NavbarMobile } from "./navbar-mobile";

export async function Navbar() {
  const authenticatedUser = await getAuthenticatedUser();

  return (
    <nav className="sticky top-0 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              href={paths.HOME}
              className="text-xl font-bold text-primary font-mono tracking-wider"
            >
              Socially
            </Link>
          </div>

          <NavbarDesktop />
          <NavbarMobile authenticatedUser={authenticatedUser} />
        </div>
      </div>
    </nav>
  );
}
