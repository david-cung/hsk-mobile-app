import { Link } from 'react-router-dom';

import { APP_NAME } from '@/app/config/constants';

import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <main className="w-full" id="main-content" tabIndex={-1}>
      <p className="m-0 mb-stack-sm text-label-sm uppercase tracking-wide text-primary">Account</p>
      <h1 className="m-0 mb-stack-md text-headline-lg-mobile text-on-surface">Sign in</h1>
      <p className="m-0 mb-stack-lg text-body-md text-on-surface-variant">
        Access your {APP_NAME} lessons, progress, and saved words.
      </p>
      <LoginForm />
      <p className="m-0 mt-stack-lg text-center text-body-md text-on-surface-variant">
        Don&apos;t have an account?{' '}
        <Link
          className="text-label-md text-primary no-underline hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus rounded-sm"
          to="/register"
        >
          Create account
        </Link>
      </p>
    </main>
  );
}
