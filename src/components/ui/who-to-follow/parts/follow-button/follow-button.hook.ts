"use client";

import { toggleFollow } from "@/actions";
import { ERROR_MESSAGES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import { useTransition } from "react";
import toast from "react-hot-toast";
import { FollowButtonHookProps } from "./follow-button.types";

export function useFollowButton(props: FollowButtonHookProps) {
  const { userToFollowId } = props;
  const [isLoading, startLoadingTransition] = useTransition();

  const handleFollowButton = async () =>
    startLoadingTransition(async () => {
      try {
        const result = await toggleFollow({ targetUserId: userToFollowId });
        const message =
          result.status === "followed"
            ? ERROR_MESSAGES.USER.FOLLOW_SUCCESS
            : ERROR_MESSAGES.USER.UNFOLLOW_SUCCESS;

        toast.success(message);
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });

  return {
    isLoading,
    handleFollowButton,
  };
}
