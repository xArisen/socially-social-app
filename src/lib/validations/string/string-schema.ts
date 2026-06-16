import { VALIDATION } from "@/lib/constants/validation.constants";
import { isNotEmpty, isNotNullable } from "@/lib/utils/type-guards.utils";
import { z } from "zod";
import type { StringSchemaProps } from "./string-schema.types";

export const stringSchema = ({
  isRequired = false,
  minLength,
  maxLength = VALIDATION.LENGTH.DEFAULT_LENGTH,
}: StringSchemaProps = {}) => {
  let schema = z
    .string()
    .max(maxLength, VALIDATION.MESSAGE.MAX.LENGTH(maxLength))
    .refine(
      (value) =>
        isNotNullable(minLength) && value.length !== 0
          ? value.length >= minLength
          : true,
      {
        message: isNotNullable(minLength)
          ? VALIDATION.MESSAGE.MIN.LENGTH(minLength)
          : undefined,
      },
    );

  if (isRequired) {
    schema = schema
      .refine((value) => isNotEmpty(value), {
        message: VALIDATION.MESSAGE.REQUIRED,
      })
      .describe("required");
  }

  return schema;
};
