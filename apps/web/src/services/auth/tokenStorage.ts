const TOKEN_STORAGE_KEY = 'hsk:access_token';

function canUseLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

/**
 * Reads the persisted access token from `localStorage`.
 * Sessions survive reloads and browser restarts until {@link clearToken} is called.
 */
export function getToken(): string | null {
  if (!canUseLocalStorage()) {
    return null;
  }

  try {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    return token && token.length > 0 ? token : null;
  } catch {
    return null;
  }
}

/**
 * Persists an access token in `localStorage`.
 */
export function setToken(token: string): void {
  if (!canUseLocalStorage()) {
    throw new Error('Token storage is only available in the browser.');
  }

  const normalizedToken = token.trim();
  if (normalizedToken.length === 0) {
    throw new Error('Cannot store an empty access token.');
  }

  window.localStorage.setItem(TOKEN_STORAGE_KEY, normalizedToken);
}

/**
 * Removes the persisted access token from `localStorage`.
 */
export function clearToken(): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch {
    return;
  }
}
