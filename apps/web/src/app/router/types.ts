/** Known application paths for typed navigation helpers. */
export type AppRoutePath =
  '/' | '/learn' | '/practice' | '/progress' | '/profile' | '/settings' | '/login';

/** Dashboard bottom-tab routes. */
export type DashboardTabPath = '/' | '/learn' | '/practice' | '/progress' | '/profile';

/** Route params keyed by path (extend as dynamic segments are added). */
export type AppRouteParams = {
  '/': Record<string, never>;
  '/learn': Record<string, never>;
  '/practice': Record<string, never>;
  '/progress': Record<string, never>;
  '/profile': Record<string, never>;
  '/settings': Record<string, never>;
  '/login': Record<string, never>;
};

/** Shared search/query params used across routes. */
export type AppSearchParams = {
  redirect?: string;
};

declare module 'react-router' {
  interface Register {
    params: AppRouteParams[AppRoutePath];
  }
}

declare module 'react-router-dom' {
  interface Register {
    params: AppRouteParams[AppRoutePath];
  }
}
