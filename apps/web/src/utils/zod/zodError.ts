import type { ZodError } from 'zod';

const ROOT_FIELD_KEY = 'root';

export type FieldErrorMap = Record<string, { type: string; message: string }>;

function toFieldPath(path: (string | number)[]): string {
  if (path.length === 0) {
    return ROOT_FIELD_KEY;
  }

  return path.map(String).join('.');
}

/**
 * Maps a Zod validation error to a React Hook Form-compatible field error map.
 * Field paths use dot notation (for example, `profile.displayName`).
 */
export function toFieldErrors(error: ZodError): FieldErrorMap {
  const fieldErrors: FieldErrorMap = {};

  for (const issue of error.issues) {
    const fieldPath = toFieldPath(issue.path);

    if (fieldPath in fieldErrors) {
      continue;
    }

    fieldErrors[fieldPath] = {
      type: issue.code,
      message: issue.message,
    };
  }

  return fieldErrors;
}
