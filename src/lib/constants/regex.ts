// Optional patterns allow an empty string; combine with `isRequired` in schemas to reject empties.
export const REGEX = {
  OPTIONAL_POSITIVE_NUMBER: /^(?:[1-9]\d*)?$/, // "" or "1", "42"
  OPTIONAL_URL: /^(?:https?:\/\/)(?:[^\s./?#]+(?:\.[^\s./?#]+)+)(?:[^\s]*)?$/, // "" or "https://example.com/path"
  OPTIONAL_EMAIL: /^(?:[^\s@]+@[^\s@]+\.[^\s@]+)?$/, // "" or "user@example.com"
  OPTIONAL_PHONE_E164: /^(?:\+?[1-9]\d{1,14})?$/, // "" or "+48123123123"
};
