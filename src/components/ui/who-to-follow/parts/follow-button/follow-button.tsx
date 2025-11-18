"use client";

import { Button } from "@/components/ui";
import { useFollowButton } from "./follow-button.hook";
import { FollowButtonProps } from "./follow-button.types";

export function FollowButton(props: FollowButtonProps) {
  const { isLoading, handleFollowButton } = useFollowButton(props);

  return (
    <Button
      size={"sm"}
      variant={"secondary"}
      className="w-20"
      onClick={handleFollowButton}
      isLoading={isLoading}
    >
      Follow
    </Button>
  );
}
