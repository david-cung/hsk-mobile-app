import { create } from 'zustand';

import { clearToken, getToken, setToken as persistToken } from '@/services';

import type { AuthState, AuthStore } from './types';

/**
 * Auth session state for components and route guards.
 *
 * Persistence uses `tokenStorage` (`localStorage`) as the single source of truth.
 * Zustand persist middleware is intentionally not used so the Axios client and
 * this store never diverge on the access token.
 */
function createSessionState(token: string | null): AuthState {
  return {
    token,
    isAuthenticated: token !== null,
  };
}

export const selectAuthToken = (state: AuthStore): string | null => state.token;

export const selectIsAuthenticated = (state: AuthStore): boolean => state.isAuthenticated;

export const useAuthStore = create<AuthStore>((set) => ({
  ...createSessionState(getToken()),
  setToken: (token) => {
    persistToken(token);
    set(createSessionState(token));
  },
  clearSession: () => {
    clearToken();
    set(createSessionState(null));
  },
}));
