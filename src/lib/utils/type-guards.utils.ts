export type Nullable<T> = T | null | undefined;

export function isNullable(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isNotNullable<T>(
  value: T,
): value is Exclude<T, null | undefined> {
  return value !== null && value !== undefined;
}

export function isNotEmpty<T = unknown>(
  value: unknown,
  typeGuard?: (value: unknown) => value is T,
): value is T {
  if (isNullable(value)) {
    return false;
  }

  if (typeGuard && !typeGuard(value)) {
    return false;
  }

  if (typeof value === "string") {
    return value.trim().length > 0;
  }

  if (typeof value === "number") {
    return !Number.isNaN(value);
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value instanceof Map || value instanceof Set) {
    return value.size > 0;
  }

  if (value instanceof Date) {
    return !Number.isNaN(value.getTime());
  }

  if (typeof value === "object") {
    return Object.keys(value as object).length > 0;
  }

  if (typeof value === "bigint" || typeof value === "symbol") {
    return true;
  }

  if (typeof value === "function") {
    return true;
  }

  return false;
}
