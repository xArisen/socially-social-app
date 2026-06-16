"use client";

import { cn } from "@/lib/utils/tailwind.utils";
import React from "react";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { InputField } from "../parts/input-field";
import type { InputFieldAccessibleName } from "../parts/input-field.types";
import { Textarea } from "../parts/text-area/text-area";

type TextareaFieldProps<TFieldValues extends FieldValues> = Omit<
  React.ComponentProps<typeof Textarea>,
  "name" | "form" | "required"
> &
  InputFieldAccessibleName & {
    form: UseFormReturn<TFieldValues>;
    name: Path<TFieldValues>;
    isRequired?: boolean;
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
  isRequired,
  ...textareaProps
}: TextareaFieldProps<TFieldValues>) {
  const accessibleNameProps =
    label !== undefined ? { label, ariaLabel } : { ariaLabel };

  return (
    // TODO: Fix input field
    <InputField
      form={form}
      name={name}
      className={wrapperClassName}
      errorClassName={errorClassName}
      id={id}
      isRequired={isRequired}
      {...accessibleNameProps}
      render={(fieldProps) => (
        <Textarea
          className={cn("min-h-[96px]", className)}
          {...textareaProps}
          {...fieldProps}
        />
      )}
    />
  );
}
