import { REGEX, VALIDATION } from "@/lib/constants";
import { isNullable, isNotEmpty } from "@/lib/utils";
import { z } from "zod";
import { IdSchemaProps } from "./id-schema.types";

export const idSchema = ({
  isRequired = false,
  regex = REGEX.POSITIVE_NUMBER_OPTIONAL,
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
      }
    );
