"use client";

import { createPost, type CreatePostPayload } from "@/actions/post.action";
import { ERROR_MESSAGES } from "@/lib/constants";
import { getErrorMessage, prepareRequestToSend } from "@/lib/utils";
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
      const request = prepareRequestToSend<CreatePostPayload>({
        content,
        imageUrl,
      });

      try {
        await createPost(request).then(() => {
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
