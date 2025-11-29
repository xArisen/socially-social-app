"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import {
  // eslint-disable-next-line no-restricted-imports
  useForm as useFormLib,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import { getErrorMessage } from "../../utils";
import {
  FormHookProps,
  FormInput,
  FormOutput,
  ZodFormSchema,
} from "./form.types";

export function useForm<TSchema extends ZodFormSchema, TResult = void>(
  options: FormHookProps<TSchema, TResult>,
) {
  const {
    schema,
    defaultValues,
    mode = "onBlur",
    reValidateMode = "onChange",
    onSuccess = true,
    handleUnexpectedError = true,
    onSubmit,
  } = options;

  const form = useFormLib<FormInput<TSchema>, unknown, FormOutput<TSchema>>({
    defaultValues,
    mode,
    reValidateMode,
    resolver: zodResolver(schema),
  });

  const handleSubmit = useMemo(
    () =>
      form.handleSubmit(async (values) => {
        try {
          const result = await onSubmit(values, form);

          if (onSuccess === true && result.message) {
            toast.success(result.message);
          } else if (typeof onSuccess === "function") {
            await onSuccess(result);
          }

          return result;
        } catch (error) {
          if (handleUnexpectedError === true) {
            toast.error(getErrorMessage(error));
          } else if (typeof handleUnexpectedError === "function") {
            handleUnexpectedError(error);
          }

          throw error;
        }
      }),
    [form, onSuccess, handleUnexpectedError, onSubmit],
  );

  return {
    ...form,
    onSubmit: handleSubmit,
    schema,
  };
}
