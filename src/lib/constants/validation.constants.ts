function conjugateCharacters(number: number): string {
  const absoluteValue = Math.abs(number);
  const unit = absoluteValue === 1 ? "character" : "characters";
  return `${number} ${unit}`;
}

export const VALIDATION = {
  MESSAGE: {
    REQUIRED: "This field is required.",
    PATTERN_MISMATCH: "The value does not match the required pattern.",
    MIN: {
      LENGTH: (min: number): string =>
        `The value must be at least ${conjugateCharacters(min)} long.`,
    },
    MAX: {
      LENGTH: (max: number): string =>
        `The value cannot exceed ${conjugateCharacters(max)}.`,
    },
  },
  LENGTH: {
    DEFAULT_LENGTH: 255,
    MAX_TEXT_LENGTH: 65000, // 65k chosen for SAFER indexes; Postgres TEXT allows up to ~1 GB.
  },
};
