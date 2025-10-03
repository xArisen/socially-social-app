"use client";

import { updateUser } from "@/actions";
import { paths } from "@/lib/constants";
import { useRouter } from "next/router";

export function useOnboardingPage() {
  const router = useRouter();

  const handleSubmit = async () => {
    const res = await updateUser();
    if (res?.message) {
      router.push(paths.HOME);
    }
  };

  return {
    handleSubmit,
  };
}
