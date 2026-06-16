"use client";

// eslint-disable-next-line no-restricted-imports
import { useRouter as useRouterLib } from "next/navigation";

import { paths } from "@/lib/constants/paths";
import { isNotEmpty } from "@/lib/utils/type-guards.utils";

export const useRouter = () => {
  const router = useRouterLib();

  // Preserve original router.back so the override can still delegate safely.
  const originalBack = router.back.bind(router);

  const handleGoBack = () => {
    if (typeof window !== "undefined") {
      const { history, location, document } = window;
      const hasLocalHistory = history.length > 1;

      const referrer = document.referrer;
      const isSafeReferrer = (() => {
        // Non-empty referrer must point to our origin; otherwise we treat it as external.
        if (!isNotEmpty(referrer)) {
          return false;
        }

        try {
          const referrerUrl = new URL(referrer);
          return referrerUrl.origin === location.origin;
        } catch {
          return false;
        }
      })();

      if (hasLocalHistory && isSafeReferrer) {
        originalBack();
        return;
      }
    }

    // Fallback to the home page when going back is unsafe.
    router.push(paths.HOME);
  };

  return Object.assign(router, { back: handleGoBack });
};
