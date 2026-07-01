import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { selectIsAuthenticated, useAuthStore } from '@/app/store/auth.store';

const LOGIN_PATH = '/login';

type UseRequireAuthOptions = {
  redirectTo?: `/${string}`;
};

type UseRequireAuthResult = {
  isAuthenticated: boolean;
  loginRedirectTo: string;
};

function buildLoginRedirectPath(
  returnPath: string,
  redirectTo: UseRequireAuthOptions['redirectTo'],
): string {
  const loginPath = redirectTo ?? LOGIN_PATH;

  if (returnPath === '/' || returnPath === loginPath) {
    return loginPath;
  }

  const searchParams = new URLSearchParams();
  searchParams.set('redirect', returnPath);

  return `${loginPath}?${searchParams.toString()}`;
}

export function useRequireAuth(options: UseRequireAuthOptions = {}): UseRequireAuthResult {
  const { redirectTo = LOGIN_PATH } = options;
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const location = useLocation();

  const loginRedirectTo = useMemo(() => {
    const returnPath = `${location.pathname}${location.search}${location.hash}`;
    return buildLoginRedirectPath(returnPath, redirectTo);
  }, [location.hash, location.pathname, location.search, redirectTo]);

  return {
    isAuthenticated,
    loginRedirectTo,
  };
}
