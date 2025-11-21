import { VALIDATION } from "@/lib/constants";
import { isNotEmpty, isNotNullable } from "@/lib/utils";
import { z } from "zod";
import { StringSchemaProps } from "./string-schema.types";

export const stringSchema = ({
  isRequired = false,
  minLength,
  maxLength = VALIDATION.LENGTH.DEFAULT_LENGTH,
}: StringSchemaProps = {}) =>
  // TODO: NEXT! Consider trimming and sending null for whitespace-only values before persisting to DB.
  z
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
      }
    )
    .refine((value) => (isRequired ? isNotEmpty(value) : true), {
      message: VALIDATION.MESSAGE.REQUIRED,
    });
