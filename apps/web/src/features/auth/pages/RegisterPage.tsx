import { Link } from 'react-router-dom';

import { APP_NAME } from '@/app/config/constants';

import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return (
    <main className="w-full" id="main-content" tabIndex={-1}>
      <p className="m-0 mb-stack-sm text-label-sm uppercase tracking-wide text-primary">Account</p>
      <h1 className="m-0 mb-stack-md text-headline-lg-mobile text-on-surface">Create account</h1>
      <p className="m-0 mb-stack-lg text-body-md text-on-surface-variant">
        Join {APP_NAME} to track your HSK progress and save vocabulary.
      </p>
      <RegisterForm />
      <p className="m-0 mt-stack-lg text-center text-body-md text-on-surface-variant">
        Already have an account?{' '}
        <Link
          className="text-label-md text-primary no-underline hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-focus rounded-sm"
          to="/login"
        >
          Sign in
        </Link>
      </p>
    </main>
  );
}
