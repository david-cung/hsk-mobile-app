import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { authApi } from '../api/endpoints';
import {
  clearTokens,
  getRefreshToken,
  getToken,
  setSessionExpiredListener,
  setTokens,
} from '../api/client';
import type { Profile, User } from '../api/types';
import { getGoogleIdToken, signOutFromGoogle } from '../auth/google';

interface AuthState {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadSession = useCallback(async () => {
    const token = await getToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setIsLoading(false);
      return;
    }
    try {
      const [me, prof] = await Promise.all([authApi.me(), authApi.profile()]);
      setUser(me);
      setProfile(prof);
    } catch {
      await clearTokens();
      setUser(null);
      setProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    setSessionExpiredListener(() => {
      setUser(null);
      setProfile(null);
    });
    return () => setSessionExpiredListener(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { access_token, refresh_token } = await authApi.login(email, password);
    await setTokens(access_token, refresh_token);
    await loadSession();
  }, [loadSession]);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const { access_token, refresh_token } = await authApi.register(email, password, displayName);
    await setTokens(access_token, refresh_token);
    await loadSession();
  }, [loadSession]);

  const loginWithGoogle = useCallback(async () => {
    const idToken = await getGoogleIdToken();
    if (!idToken) return;
    const { access_token, refresh_token } = await authApi.google(idToken);
    await setTokens(access_token, refresh_token);
    await loadSession();
  }, [loadSession]);

  const logout = useCallback(async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch {
        // Local logout must remain available while offline.
      }
    }
    await Promise.all([clearTokens(), signOutFromGoogle()]);
    setUser(null);
    setProfile(null);
  }, []);

  const deleteAccount = useCallback(async () => {
    await authApi.deleteAccount();
    await Promise.all([clearTokens(), signOutFromGoogle()]);
    setUser(null);
    setProfile(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const prof = await authApi.profile();
    setProfile(prof);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      loginWithGoogle,
      logout,
      deleteAccount,
      refreshProfile,
    }),
    [
      user,
      profile,
      isLoading,
      login,
      register,
      loginWithGoogle,
      logout,
      deleteAccount,
      refreshProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
