"use client";

import { cn } from "@/lib/utils/tailwind.utils";
import { isNotEmpty, isNotNullable } from "@/lib/utils/type-guards.utils";
import { Controller, FieldValues } from "react-hook-form";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "./field/field";
import type { InputFieldProps } from "./input-field.types";

export function InputField<TFieldValues extends FieldValues>({
  render,
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
  isRequired,
}: InputFieldProps<TFieldValues>) {
  const inputId = id ?? name;
  const labelId = label ? `${inputId}-label` : undefined;

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
        const ariaLabelValue = hasLabel ? undefined : ariaLabel;

        const renderedChild = render({
          ...field,
          id: inputId,
          "aria-invalid": fieldState.invalid,
          "aria-describedby": describedBy || undefined,
          "aria-labelledby": labelId,
          // When there's no visual label, fall back to an aria-label for an accessible name.
          "aria-label": ariaLabelValue,
          required: isRequired || undefined,
          value: field.value ?? "",
        });

        return (
          <Field data-invalid={fieldState.invalid} className={className}>
            {label ? (
              <FieldLabel
                id={labelId}
                htmlFor={inputId}
                className={labelClassName}
              >
                <span>
                  {label}
                  {isRequired ? (
                    <span aria-hidden="true" className="text-destructive">
                      *
                    </span>
                  ) : null}
                </span>
              </FieldLabel>
            ) : null}

            <FieldContent>
              {renderedChild}
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
