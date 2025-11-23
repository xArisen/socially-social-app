"use client";

import { createPost } from "@/actions/post.action";
import { useAppForm } from "@/lib/hooks/use-app-form";
import { createPostSchema } from "@/schemas/create-post-schema";
import { useState } from "react";
import { emptyValues } from "./create-post.constants";

export function useCreatePost() {
  const [showImageUpload, setShowImageUpload] = useState(false);
  const {
    register,
    watch,
    formState: { isSubmitting },
    onSubmit,
    // TODO: IMPORTANT! Fix and rename useAppForm. Forbid useForm imports (eslint rule).
  } = useAppForm({
    schema: createPostSchema,
    defaultValues: emptyValues,
    // TODO: IMPORTANT! Maybe force onSubmit to return value, to not forget to pass it. It will let us pass result, pass deconstructed custom result, or pass null.
    onSubmit: async (values, form) => {
      // TODO: IMPORTANT! Add a hook that lets us use actions (e.g., outside a form — at the top of the file) and, when an error is thrown, doesn’t crash the app.
      const result = await createPost(values);

      form.reset();
      setShowImageUpload(false);
      return result;
    },
  });

  const content = watch("content") ?? "";
  const imageUrl = watch("imageUrl") ?? "";

  return {
    register,
    content,
    imageUrl,
    isPosting: isSubmitting,
    setShowImageUpload,
    showImageUpload,
    onSubmit,
  };
}
