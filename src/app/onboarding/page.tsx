"use client";

import { Button } from "@/components/ui/button/button";
import { useOnboardingPage } from "./onboarding.hook";

export default function OnboardingPage() {
  const { handleSubmit, isSubmitting } = useOnboardingPage();

  return (
    <div className="flex flex-col gap-3">
      <h1>Welcome!</h1>
      <p>
        You have just logged in to the website. Before you can start using it,
        you must confirm your account creation. To do so, click the button below
        labeled &quot;Confirm&quot;.
      </p>
      <form action={handleSubmit}>
        <Button isLoading={isSubmitting} type="submit">
          Confirm
        </Button>
      </form>
    </div>
  );
}
