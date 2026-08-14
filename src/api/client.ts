import * as Keychain from 'react-native-keychain';

import { API_URL } from '../config';

const TOKEN_SERVICE = 'hsk_access_token';
const REFRESH_TOKEN_SERVICE = 'hsk_refresh_token';

type SessionExpiredListener = () => void;
let sessionExpiredListener: SessionExpiredListener | null = null;
let refreshPromise: Promise<string | null> | null = null;

export async function getToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({ service: TOKEN_SERVICE });
  if (creds && typeof creds !== 'boolean') {
    return creds.password;
  }
  return null;
}

export async function getRefreshToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({ service: REFRESH_TOKEN_SERVICE });
  if (creds && typeof creds !== 'boolean') {
    return creds.password;
  }
  return null;
}

export async function setTokens(accessToken: string, refreshToken: string): Promise<void> {
  await Promise.all([
    Keychain.setGenericPassword('access_token', accessToken, { service: TOKEN_SERVICE }),
    Keychain.setGenericPassword('refresh_token', refreshToken, {
      service: REFRESH_TOKEN_SERVICE,
    }),
  ]);
}

export async function clearTokens(): Promise<void> {
  await Promise.all([
    Keychain.resetGenericPassword({ service: TOKEN_SERVICE }),
    Keychain.resetGenericPassword({ service: REFRESH_TOKEN_SERVICE }),
  ]);
}

export function setSessionExpiredListener(listener: SessionExpiredListener | null) {
  sessionExpiredListener = listener;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

function formatApiDetail(detail: unknown, fallback: string) {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (item && typeof item === 'object' && 'msg' in item) {
          return String((item as { msg: unknown }).msg);
        }
        return JSON.stringify(item);
      })
      .join('\n');
  }
  if (detail && typeof detail === 'object') return JSON.stringify(detail);
  return fallback;
}

async function refreshAccessToken(): Promise<string | null> {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });
      if (!response.ok) {
        return null;
      }
      const tokens = (await response.json()) as {
        access_token: string;
        refresh_token: string;
      };
      await setTokens(tokens.access_token, tokens.refresh_token);
      return tokens.access_token;
    } catch {
      return null;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean; retryAuth?: boolean } = {},
): Promise<T> {
  const { auth = true, retryAuth = true, ...requestOptions } = options;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(requestOptions.headers as Record<string, string>),
  };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers,
  });

  if (response.status === 401 && auth && retryAuth) {
    const refreshedAccessToken = await refreshAccessToken();
    if (refreshedAccessToken) {
      response = await fetch(`${API_URL}${path}`, {
        ...requestOptions,
        headers: { ...headers, Authorization: `Bearer ${refreshedAccessToken}` },
      });
    }
    if (!refreshedAccessToken || response.status === 401) {
      await clearTokens();
      sessionExpiredListener?.();
    }
  }

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = formatApiDetail(body.detail ?? body, response.statusText);
    } catch {
      /* ignore */
    }
    throw new ApiError(String(detail), response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
