"use client";

import { createPost } from "@/actions/post.action";
import { ERROR_MESSAGES } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import { useCallback, useState, useTransition } from "react";
import toast from "react-hot-toast";

export function useCreatePost() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useTransition();
  const [showImageUpload, setShowImageUpload] = useState(false);

  const resetForm = useCallback(() => {
    setContent("");
    setImageUrl("");
    setShowImageUpload(false);
  }, []);

  // TODO: Consider switching to React Hook Form
  const handleSubmit = () =>
    setIsPosting(async () => {
      try {
        await createPost({
          content,
          imageUrl,
        }).then(() => {
          resetForm();
          toast.success(ERROR_MESSAGES.POST.CREATE_SUCCESS);
        });
      } catch (error: unknown) {
        toast.error(getErrorMessage(error));
      }
    });

  return {
    content,
    setContent,
    imageUrl,
    isPosting,
    setShowImageUpload,
    handleSubmit,
  };
}
