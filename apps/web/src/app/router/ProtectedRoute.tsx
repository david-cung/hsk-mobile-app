import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useRequireAuth } from '@/hooks/useRequireAuth';

export function ProtectedRoute() {
  const { isAuthenticated, loginRedirectTo } = useRequireAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to={loginRedirectTo} />;
  }

  return <Outlet />;
}
