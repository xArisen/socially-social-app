"use client";

import {
  DefaultValues,
  FieldValues,
  UseFormProps,
  UseFormReturn,
} from "react-hook-form";
import { z } from "zod";
import { ActionResult } from "../../types/action.types";

export type ZodFormSchema<
  TOutput extends FieldValues = FieldValues,
  TInput extends FieldValues = TOutput,
> = z.ZodType<TOutput, TInput>;
export type FormInput<TSchema extends ZodFormSchema> = z.input<TSchema>;
export type FormOutput<TSchema extends ZodFormSchema> = z.output<TSchema>;

export interface FormHookProps<TSchema extends ZodFormSchema, TResult = void> {
  schema: TSchema;
  defaultValues: DefaultValues<FormInput<TSchema>>;
  mode?: UseFormProps<FormInput<TSchema>>["mode"];
  reValidateMode?: UseFormProps<FormInput<TSchema>>["reValidateMode"];
  onSubmit: (
    values: FormOutput<TSchema>,
    form: UseFormReturn<FormInput<TSchema>, unknown, FormOutput<TSchema>>,
  ) => ActionResult<TResult> | Promise<ActionResult<TResult>>;
  onSuccess?:
    | boolean
    | ((result: ActionResult<TResult>) => void | Promise<void>);
  handleUnexpectedError?: boolean | ((error: unknown) => void);
}
