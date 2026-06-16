import { REGEX } from "@/lib/constants/regex";
import { VALIDATION } from "@/lib/constants/validation.constants";
import { isNotEmpty, isNullable } from "@/lib/utils/type-guards.utils";
import { z } from "zod";
import type { IdSchemaProps } from "./id-schema.types";

export const idSchema = ({
  isRequired = false,
  regex = REGEX.OPTIONAL_POSITIVE_NUMBER,
  maxLength = VALIDATION.LENGTH.DEFAULT_LENGTH,
}: IdSchemaProps = {}) =>
  z
    .string()
    .max(maxLength, VALIDATION.MESSAGE.MAX.LENGTH(maxLength))
    .refine((value) => (isRequired ? isNotEmpty(value) : true), {
      message: VALIDATION.MESSAGE.REQUIRED,
    })
    .refine(
      (value) => {
        if (isNullable(regex)) {
          return true;
        }

        return regex.test(value);
      },
      {
        message: VALIDATION.MESSAGE.PATTERN_MISMATCH,
      },
    );
