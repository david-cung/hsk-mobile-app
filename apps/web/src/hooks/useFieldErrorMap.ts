import { useCallback } from 'react';
import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';

import { type ApiFieldError, isApiError } from '@/services';
import { type FieldErrorMap, isZodError, toFieldErrors } from '@/utils';

const ROOT_FIELD_KEY = 'root';

function isApiFieldError(value: unknown): value is ApiFieldError {
  return (
    typeof value === 'object' &&
    value !== null &&
    'message' in value &&
    typeof value.message === 'string'
  );
}

function applyFieldErrorMap<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  fieldErrors: FieldErrorMap,
): void {
  for (const [field, fieldError] of Object.entries(fieldErrors)) {
    setError(field as FieldPath<TFieldValues>, {
      type: fieldError.type,
      message: fieldError.message,
    });
  }
}

function applyApiFieldErrors<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
  fieldErrors: ApiFieldError[],
): void {
  for (const fieldError of fieldErrors) {
    const fieldName = fieldError.field ?? ROOT_FIELD_KEY;

    setError(fieldName as FieldPath<TFieldValues>, {
      type: 'server',
      message: fieldError.message,
    });
  }
}

export function useFieldErrorMap<TFieldValues extends FieldValues>(
  setError: UseFormSetError<TFieldValues>,
) {
  const mapFieldErrorMap = useCallback(
    (fieldErrors: FieldErrorMap) => {
      applyFieldErrorMap(setError, fieldErrors);
    },
    [setError],
  );

  const mapFieldErrors = useCallback(
    (error: unknown) => {
      if (isZodError(error)) {
        mapFieldErrorMap(toFieldErrors(error));
        return;
      }

      if (isApiError(error)) {
        if (Array.isArray(error.details)) {
          const apiFieldErrors = error.details.filter(isApiFieldError);

          if (apiFieldErrors.length > 0) {
            applyApiFieldErrors(setError, apiFieldErrors);
            return;
          }
        }

        setError(ROOT_FIELD_KEY as FieldPath<TFieldValues>, {
          type: 'server',
          message: error.message,
        });
        return;
      }

      if (error instanceof Error) {
        setError(ROOT_FIELD_KEY as FieldPath<TFieldValues>, {
          type: 'server',
          message: error.message,
        });
      }
    },
    [mapFieldErrorMap, setError],
  );

  return {
    mapFieldErrorMap,
    mapFieldErrors,
  };
}
