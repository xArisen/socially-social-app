"use client";

import React from "react";
import { Controller, FieldValues, Path, UseFormReturn } from "react-hook-form";

import { cn, isNotEmpty, isNotNullable } from "@/lib/utils";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "./field";

export type InputFieldWithLabel = {
  label: string;
  ariaLabel?: string;
};

export type InputFieldAriaOnly = {
  label?: undefined;
  ariaLabel: string;
};

export type InputFieldAccessibleName = InputFieldWithLabel | InputFieldAriaOnly;

type InputFieldProps<TFieldValues extends FieldValues> =
  InputFieldAccessibleName & {
    form: UseFormReturn<TFieldValues>;
    name: Path<TFieldValues>;
    children: React.ReactElement;
    description?: React.ReactNode;
    className?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    errorClassName?: string;
    id?: string;
  };

export function InputField<TFieldValues extends FieldValues>({
  children,
  label,
  ariaLabel,
  form,
  name,
  className,
  labelClassName,
  descriptionClassName,
  errorClassName,
  description,
  id,
}: InputFieldProps<TFieldValues>) {
  const inputId = id ?? name;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field, fieldState }) => {
        const error = fieldState.error;
        const errors = isNotNullable(error) ? [error] : undefined;
        const hasDescription = isNotNullable(description);
        const hasErrors = isNotEmpty(errors);
        const descriptionId = `${inputId}-description`;
        const errorId = `${inputId}-error`;
        const describedBy = [
          hasDescription ? descriptionId : null,
          hasErrors ? errorId : null,
        ]
          .filter(isNotNullable)
          .join(" ");

        const hasLabel = isNotNullable(label);
        const ariaLabelValue = hasLabel
          ? children.props["aria-label"]
          : isNotEmpty(ariaLabel)
            ? ariaLabel
            : children.props["aria-label"];

        const child =
          React.isValidElement(children) && inputId
            ? React.cloneElement(children, {
                ...field,
                id: inputId,
                "aria-invalid": fieldState.invalid,
                "aria-describedby": describedBy || undefined,
                "aria-label": ariaLabelValue,
                value: field.value ?? "",
              })
            : children;

        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            {label ? (
              <FieldLabel htmlFor={inputId} className={labelClassName}>
                {label}
              </FieldLabel>
            ) : null}

            <FieldContent>
              {child}
              {description ? (
                <FieldDescription
                  id={descriptionId}
                  className={descriptionClassName}
                >
                  {description}
                </FieldDescription>
              ) : null}
              <FieldError
                id={errorId}
                className={cn("text-xs", errorClassName)}
                errors={errors}
              />
            </FieldContent>
          </Field>
        );
      }}
    />
  );
}
