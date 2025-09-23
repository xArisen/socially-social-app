export type Nullable<T> = T | null | undefined;

export function isNullable(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

export function isNotNullable<T>(
  value: T
): value is Exclude<T, null | undefined> {
  return value !== null && value !== undefined;
}
