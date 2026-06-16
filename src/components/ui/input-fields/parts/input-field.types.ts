"use client";

import React from "react";
import {
  ControllerRenderProps,
  FieldValues,
  Path,
  UseFormReturn,
} from "react-hook-form";

export type InputFieldWithLabel = {
  label: string;
  ariaLabel?: string;
};

export type InputFieldAriaOnly = {
  label?: undefined;
  ariaLabel: string;
};

export type InputFieldAccessibleName = InputFieldWithLabel | InputFieldAriaOnly;

export type InputFieldRenderProps<
  TFieldValues extends FieldValues = FieldValues,
> = Omit<ControllerRenderProps<TFieldValues>, "value"> & {
  value: ControllerRenderProps<TFieldValues>["value"] | "";
  id: string;
  "aria-invalid": boolean;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  required?: boolean;
};

export type InputFieldProps<TFieldValues extends FieldValues> =
  InputFieldAccessibleName & {
    form: UseFormReturn<TFieldValues>;
    name: Path<TFieldValues>;
    render: (props: InputFieldRenderProps<TFieldValues>) => React.ReactElement;
    description?: React.ReactNode;
    className?: string;
    labelClassName?: string;
    descriptionClassName?: string;
    errorClassName?: string;
    id?: string;
    isRequired?: boolean;
  };
