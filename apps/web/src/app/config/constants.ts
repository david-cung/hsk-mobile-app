export const APP_NAME = 'HSK Chinese Master' as const;

export const APP_TAGLINE = 'Learn Chinese step by step' as const;

export const APP_DESCRIPTION =
  'Structured Mandarin lessons, practice, and progress tracking aligned to HSK levels.' as const;

/** Default HTTP request timeout for API calls (milliseconds). */
export const API_REQUEST_TIMEOUT_MS = 30_000 as const;

/** React Query default stale time (milliseconds). */
export const QUERY_STALE_TIME_MS = 30_000 as const;

/** React Query default retry count for failed requests. */
export const QUERY_RETRY_COUNT = 1 as const;
