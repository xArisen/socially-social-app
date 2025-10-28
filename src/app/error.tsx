"use client";

import { AlertTriangle } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button/button";
import { useRouter } from "@/lib/client/hooks/router.hook";
import { paths } from "@/lib/constants/paths";

// TODO: INFO global-error.tsx can provide an app-wide fallback if we decide to add it.

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg border border-border bg-background/80 p-8 text-center shadow-sm">
        <AlertTriangle aria-hidden className="size-10 text-destructive" />
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-sm text-muted-foreground">
            {error.message || "Please try again in a moment."}
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button variant="secondary" onClick={() => router.back()}>
            Go back
          </Button>
          <Button variant="outline" onClick={() => router.push(paths.HOME)}>
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}
