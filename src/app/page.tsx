import { ThemeModeToggleButton } from "@/components/theme/theme-mode-toggle-button";
import { Button } from "@/components/ui/button/button";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

export default function HomePage() {
  return (
    <div className="m-2">
      <div className="flex justify-between gap-10">
        <ThemeModeToggleButton />
        <div className="flex gap-2">
          <SignedOut>
            <SignInButton mode="modal">
              <Button variant="default">Sign In</Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button variant="secondary">Sign Up</Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
