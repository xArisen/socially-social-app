"use client";

import { FileSearch } from "lucide-react";

import { Button } from "@/components/ui/button/button";
import { useRouter } from "@/lib/client/hooks/router.hook";
import { paths } from "@/lib/constants/paths";

{
  /* TODO: INFO Prefer calling notFound() from next/navigation (server components/actions) or returning NextResponse.json(..., { status: 404 }) in route handlers when lookups fail; this keeps the template for unexpected fallbacks only. */
}

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-md flex-col items-center gap-6 rounded-lg border border-border bg-background/80 p-8 text-center shadow-sm">
        <FileSearch aria-hidden className="size-10 text-muted-foreground" />
        <div className="flex flex-col gap-3">
          <h2 className="text-xl font-semibold">Page not found</h2>
          <p className="text-sm text-muted-foreground">
            The page you’re looking for doesn’t exist or might have been moved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
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
