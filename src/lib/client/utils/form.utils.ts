import type { FieldValues, Path, UseFormSetError } from "react-hook-form";

export type ActionResult<TField extends string = string> =
  | { ok: true; message?: string }
  | {
      ok: false;
      message?: string;
      fieldErrors?: Partial<Record<TField, string>>;
    };

// Maps server field errors onto react-hook-form.setError.
export function applyServerErrors<
  TValues extends FieldValues,
  TField extends Path<TValues> = Path<TValues>,
>(
  fieldErrors: Partial<Record<TField, string>> | undefined,
  setError: UseFormSetError<TValues>
) {
  if (!fieldErrors) {
    return;
  }

  for (const name of Object.keys(fieldErrors) as TField[]) {
    const message = fieldErrors[name];
    if (message) {
      setError(name, { type: "server", message });
    }
  }
}
