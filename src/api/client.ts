import * as Keychain from 'react-native-keychain';

import { API_URL } from '../config';

const TOKEN_SERVICE = 'hsk_access_token';

export async function getToken(): Promise<string | null> {
  const creds = await Keychain.getGenericPassword({ service: TOKEN_SERVICE });
  if (creds && typeof creds !== 'boolean') {
    return creds.password;
  }
  return null;
}

export async function setToken(token: string): Promise<void> {
  await Keychain.setGenericPassword('token', token, { service: TOKEN_SERVICE });
}

export async function clearToken(): Promise<void> {
  await Keychain.resetGenericPassword({ service: TOKEN_SERVICE });
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (options.auth !== false) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let detail = response.statusText;
    try {
      const body = await response.json();
      detail = body.detail ?? (typeof body === 'string' ? body : JSON.stringify(body));
    } catch {
      /* ignore */
    }
    throw new ApiError(String(detail), response.status);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
