import { isAxiosError } from 'axios';

export type ApiFieldError = {
  field?: string;
  message: string;
};

export type ApiErrorDetails = string | ApiFieldError[] | Record<string, unknown>;

type ApiErrorOptions = {
  message: string;
  status: number;
  details?: ApiErrorDetails;
  isNetworkError?: boolean;
  isTimeout?: boolean;
  cause?: unknown;
};

type FastApiValidationIssue = {
  loc?: (string | number)[];
  msg?: string;
  type?: string;
};

type FastApiErrorBody = {
  detail?: string | FastApiValidationIssue[] | unknown;
  message?: string;
};

export class ApiError extends Error {
  readonly name = 'ApiError';

  readonly status: number;

  readonly details?: ApiErrorDetails;

  readonly isNetworkError: boolean;

  readonly isTimeout: boolean;

  constructor(options: ApiErrorOptions) {
    super(options.message, { cause: options.cause });
    this.status = options.status;
    this.details = options.details;
    this.isNetworkError = options.isNetworkError ?? false;
    this.isTimeout = options.isTimeout ?? false;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

function getDefaultMessageForStatus(status: number): string {
  switch (status) {
    case 400:
      return 'The request was invalid.';
    case 401:
      return 'You are not authenticated.';
    case 403:
      return 'You do not have permission to perform this action.';
    case 404:
      return 'The requested resource was not found.';
    case 408:
      return 'The request timed out.';
    case 422:
      return 'Some fields are invalid.';
    case 429:
      return 'Too many requests. Please try again later.';
    case 500:
      return 'An unexpected server error occurred.';
    case 502:
      return 'The server is temporarily unavailable.';
    case 503:
      return 'The service is temporarily unavailable.';
    default:
      if (status >= 500) {
        return 'An unexpected server error occurred.';
      }

      if (status >= 400) {
        return 'The request could not be completed.';
      }

      return 'Something went wrong.';
  }
}

function isFastApiValidationIssue(value: unknown): value is FastApiValidationIssue {
  return typeof value === 'object' && value !== null;
}

function formatValidationField(loc: (string | number)[] | undefined): string | undefined {
  if (!loc || loc.length === 0) {
    return undefined;
  }

  const fieldPath = loc
    .filter((segment) => segment !== 'body' && segment !== 'query' && segment !== 'path')
    .map(String)
    .join('.');

  return fieldPath.length > 0 ? fieldPath : undefined;
}

function parseValidationIssues(issues: FastApiValidationIssue[]): ApiFieldError[] {
  return issues.map((issue) => ({
    field: formatValidationField(issue.loc),
    message: issue.msg ?? 'Validation error',
  }));
}

function extractErrorFromBody(
  body: unknown,
  status: number,
): { message: string; details?: ApiErrorDetails } {
  if (body == null) {
    return { message: getDefaultMessageForStatus(status) };
  }

  if (typeof body === 'string') {
    const trimmedBody = body.trim();
    return {
      message: trimmedBody.length > 0 ? trimmedBody : getDefaultMessageForStatus(status),
      details: trimmedBody.length > 0 ? trimmedBody : undefined,
    };
  }

  if (typeof body !== 'object') {
    return { message: String(body) };
  }

  const payload = body as FastApiErrorBody;

  if (typeof payload.detail === 'string') {
    const trimmedDetail = payload.detail.trim();
    return {
      message: trimmedDetail.length > 0 ? trimmedDetail : getDefaultMessageForStatus(status),
      details: trimmedDetail.length > 0 ? trimmedDetail : undefined,
    };
  }

  if (Array.isArray(payload.detail)) {
    const fieldErrors = parseValidationIssues(
      payload.detail.filter((issue) => isFastApiValidationIssue(issue)),
    );

    if (fieldErrors.length === 0) {
      return { message: getDefaultMessageForStatus(status) };
    }

    const message = fieldErrors
      .map((fieldError) =>
        fieldError.field ? `${fieldError.field}: ${fieldError.message}` : fieldError.message,
      )
      .join('; ');

    return { message, details: fieldErrors };
  }

  if (typeof payload.message === 'string' && payload.message.trim().length > 0) {
    return {
      message: payload.message.trim(),
      details: body as Record<string, unknown>,
    };
  }

  return {
    message: getDefaultMessageForStatus(status),
    details: body as Record<string, unknown>,
  };
}

function isTimeoutError(error: { code?: string; message: string }): boolean {
  return error.code === 'ECONNABORTED' || error.message.toLowerCase().includes('timeout');
}

function isCancelledRequest(error: { code?: string }): boolean {
  return error.code === 'ERR_CANCELED';
}

export function normalizeAxiosError(error: unknown): ApiError {
  if (isApiError(error)) {
    return error;
  }

  if (isAxiosError(error)) {
    if (isCancelledRequest(error)) {
      return new ApiError({
        message: 'The request was cancelled.',
        status: 0,
        cause: error,
      });
    }

    if (isTimeoutError(error)) {
      return new ApiError({
        message: 'The request timed out. Check your connection and try again.',
        status: 408,
        isTimeout: true,
        cause: error,
      });
    }

    if (!error.response) {
      return new ApiError({
        message: 'Unable to reach the server. Check your connection and try again.',
        status: 0,
        isNetworkError: true,
        cause: error,
      });
    }

    const { status, data } = error.response;
    const { message, details } = extractErrorFromBody(data, status);

    return new ApiError({
      message,
      status,
      details,
      cause: error,
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      message: error.message || 'An unexpected error occurred.',
      status: 0,
      cause: error,
    });
  }

  return new ApiError({
    message: 'An unexpected error occurred.',
    status: 0,
    cause: error,
  });
}
