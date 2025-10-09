"use client";

import { completeUserOnboarding } from "@/actions";
import { useRouter } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";

export function useOnboardingPage() {
  const router = useRouter();
  const { getToken } = useAuth();

  const handleSubmit = async () => {
    const res = await completeUserOnboarding();
    if (res?.message) {
      await getToken({ skipCache: true });
      router.refresh();
    }
  };

  return {
    handleSubmit,
  };
}
