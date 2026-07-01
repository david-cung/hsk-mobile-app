import { Link, Outlet } from 'react-router-dom';

import { APP_NAME } from '@/app/config/constants';

export function AuthLayout() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col bg-background">
      <header
        className="flex items-center justify-between px-margin-mobile py-stack-md sm:px-6"
        role="banner"
      >
        <Link
          className="rounded-sm text-headline-md text-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
          to="/"
        >
          {APP_NAME}
        </Link>
      </header>
      <div className="flex flex-1 flex-col items-center justify-center px-margin-mobile pb-stack-lg pt-stack-sm sm:px-6 md:px-8 md:pb-12 md:pt-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
