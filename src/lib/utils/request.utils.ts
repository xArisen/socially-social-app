type PlainObject = Record<string, unknown>;

type PreparedArray<T> =
  T extends Array<infer U> ? Array<PreparedValue<U>> : never;

type PreparedValue<T> = T extends string
  ? string | null
  : T extends number
    ? number | null
    : T extends boolean
      ? boolean
      : T extends Array<unknown>
        ? PreparedArray<T>
        : T;

export type PreparedRequest<T extends PlainObject> = {
  [K in keyof T]: PreparedValue<T[K]>;
};

const isPlainObject = (value: unknown): value is PlainObject =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  !(value instanceof Date);

const normalisePrimitive = (value: unknown) => {
  if (value === null || value === undefined) {
    return null;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return null;
};

const normaliseArray = (value: unknown[]): unknown[] =>
  value.map((item) => {
    if (isPlainObject(item)) {
      return item;
    }

    if (Array.isArray(item)) {
      return normaliseArray(item);
    }

    return normalisePrimitive(item);
  });

/**
 * Prepares payload data to be sent over the network by trimming primitives
 * and converting empty values to null. Nested objects are left untouched.
 */
export function prepareRequestToSend<T extends PlainObject>(
  payload: T
): PreparedRequest<T> {
  if (!isPlainObject(payload)) {
    throw new TypeError("Payload must be a plain object");
  }

  const result: PlainObject = {};

  Object.entries(payload).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      result[key] = normaliseArray(value);
      return;
    }

    if (isPlainObject(value)) {
      result[key] = value;
      return;
    }

    result[key] = normalisePrimitive(value);
  });

  return result as PreparedRequest<T>;
}
