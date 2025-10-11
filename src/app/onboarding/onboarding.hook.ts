"use client";

import { completeUserOnboarding } from "@/actions";
import { useRouter } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { useTransition } from "react";

export function useOnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();
  const [isPending, startTransition] = useTransition();

  // TODO: Consider switching to React Hook Form
  const handleSubmit = () =>
    startTransition(async () => {
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
