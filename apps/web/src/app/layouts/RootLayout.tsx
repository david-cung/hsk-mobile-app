import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

function RouteLoadingFallback() {
  return (
    <main
      className="flex min-h-dvh items-center justify-center px-margin-mobile"
      id="main-content"
      aria-busy="true"
      aria-live="polite"
      tabIndex={-1}
    >
      <p className="text-body-md text-on-surface-variant">Loading…</p>
    </main>
  );
}

export function RootLayout() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <div className="flex min-h-dvh flex-col bg-background">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Outlet />
        </Suspense>
      </div>
    </>
  );
}
