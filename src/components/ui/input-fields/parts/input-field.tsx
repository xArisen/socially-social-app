"use client";

import { cn } from "@/lib/utils/tailwind.utils";
import { isNotEmpty, isNotNullable } from "@/lib/utils/type-guards.utils";
import { Controller, FieldValues } from "react-hook-form";
import { z } from "zod";
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
  required,
}: InputFieldProps<TFieldValues>) {
  const inputId = id ?? name;
  const labelId = label ? `${inputId}-label` : undefined;

  // TODO: Cofnij draft commit i wróć do dodawnia automatycznego required i do unwrapSchema.
  const unwrapSchema = (schema: z.ZodTypeAny): z.ZodTypeAny => {
    if (
      schema instanceof z.ZodOptional ||
      schema instanceof z.ZodNullable ||
      schema instanceof z.ZodDefault
    ) {
      return unwrapSchema(schema.unwrap() as z.ZodTypeAny);
    }
    return schema;
  };

  const getRequiredFromSchema = (): boolean => {
    const schema = form.schema;
    if (!(schema instanceof z.ZodObject)) {
      return false;
    }

    const fieldSchema = schema.shape[name as string];
    if (!fieldSchema) {
      return false;
    }

    const baseSchema = unwrapSchema(fieldSchema);
    return baseSchema.description === "required";
  };

  const isRequired = required ?? getRequiredFromSchema();

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
                {label}
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
