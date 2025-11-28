"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { Textarea } from "../parts";
import { InputField, InputFieldAccessibleName } from "../parts/input-field";

type TextareaFieldProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<typeof Textarea>,
  "name" | "form"
> &
  InputFieldAccessibleName & {
    form: UseFormReturn<TFieldValues>;
    name: Path<TFieldValues>;
    wrapperClassName?: string;
    errorClassName?: string;
  };

export function TextareaField<TFieldValues extends FieldValues>({
  form,
  name,
  label,
  ariaLabel,
  wrapperClassName,
  errorClassName,
  className,
  id,
  ...textareaProps
}: TextareaFieldProps<TFieldValues>) {
  return (
    // TODO: Fix input field
    <InputField
      form={form}
      name={name}
      label={label}
      ariaLabel={ariaLabel}
      className={wrapperClassName}
      errorClassName={errorClassName}
      id={id}
    >
      {/* TODO: Fix Texarea styles */}
      <Textarea className={cn("min-h-[96px]", className)} {...textareaProps} />
    </InputField>
  );
}
