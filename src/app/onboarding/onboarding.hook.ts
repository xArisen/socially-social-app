"use client";

import { completeUserOnboarding } from "@/actions/user.action";
import { useRouter } from "@/lib/client/hooks/router.hook";
import { useAuth } from "@clerk/nextjs";
import { useTransition } from "react";

export function useOnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isPending, startPendingTransition] = useTransition();

  // TODO: Consider switching to React Hook Form
  const handleSubmit = () =>
    startPendingTransition(async () => {
      const res = await completeUserOnboarding();
      if (res?.message) {
        await getToken({ skipCache: true });
        router.refresh();
      }
    });

  return {
    handleSubmit,
    isSubmitting: isPending,
  };
}
