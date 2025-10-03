"use client";

import { updateUser } from "@/actions";
import { useRouter } from "next/router";

export function useOnboardingPage() {
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await updateUser();
    if (res?.message) {
      router.push("/");
    }
  };

  return {
    handleSubmit,
  };
}
