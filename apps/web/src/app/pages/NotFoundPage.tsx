import { Link } from 'react-router-dom';

import { APP_NAME } from '@/app/config/constants';

export function NotFoundPage() {
  return (
    <>
      <header
        className="border-b border-surface-container bg-surface-container-lowest"
        role="banner"
      >
        <p className="m-0 px-margin-mobile py-stack-md text-headline-md text-primary">{APP_NAME}</p>
      </header>
      <main
        className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <h1 className="m-0 mb-stack-md text-headline-lg-mobile text-on-surface">Page not found</h1>
        <p className="m-0 mb-stack-lg max-w-prose text-body-md text-on-surface-variant">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          className="inline-flex w-fit rounded-md bg-primary px-stack-md py-stack-sm text-label-md text-on-primary no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
          to="/"
        >
          Return to home
        </Link>
      </main>
    </>
  );
}
