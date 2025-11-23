"use client";

import { useMemo } from "react";
import {
  DefaultValues,
  FieldError,
  FieldErrors,
  Resolver,
  UseFormProps,
  UseFormReturn,
  useForm,
} from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";
import { ActionResult } from "../types/action.types";
import { getErrorMessage } from "../utils";

export interface UseAppFormOptions<
  TSchema extends z.ZodTypeAny,
  TResult = void,
> {
  schema: TSchema;
  defaultValues: DefaultValues<z.input<TSchema>>;
  mode?: UseFormProps<z.infer<TSchema>>["mode"];
  reValidateMode?: UseFormProps<z.infer<TSchema>>["reValidateMode"];
  onSubmit: (
    values: z.infer<TSchema>,
    form: UseFormReturn<z.infer<TSchema>>,
  ) => ActionResult<TResult> | Promise<ActionResult<TResult>>;
  onSuccess?:
    | boolean
    | ((result: ActionResult<TResult>) => void | Promise<void>);
  handleUnexpectedError?: boolean | ((error: unknown) => void);
}

function zodResolver<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
): Resolver<z.infer<TSchema>> {
  return async (values) => {
    const parsed = schema.safeParse(values);

    if (parsed.success) {
      return { values: parsed.data, errors: {} };
    }

    const flattenErrors = parsed.error.flatten();
    const fieldErrors = Object.entries(flattenErrors.fieldErrors).reduce(
      (errors, [field, messages]) => {
        if (messages?.length) {
          errors[field as keyof z.infer<TSchema>] = {
            type: "validation",
            message: messages[0],
          } as FieldError;
        }
        return errors;
      },
      {} as FieldErrors<z.infer<TSchema>>,
    );

    return { values: {}, errors: fieldErrors };
  };
}

export function useAppForm<TSchema extends z.ZodTypeAny, TResult = void>(
  options: UseAppFormOptions<TSchema, TResult>,
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

  const form = useForm<z.infer<TSchema>>({
    defaultValues,
    mode,
    reValidateMode,
    resolver: useMemo(() => zodResolver(schema), [schema]),
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
  };
}
