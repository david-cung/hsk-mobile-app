import { ProfileHeader } from '../components/ProfileHeader';
import { ProfileMenu } from '../components/ProfileMenu';

const PROFILE_PLACEHOLDER = {
  name: 'Alex',
  email: 'alex@example.com',
  initials: 'AL',
  subtitle: 'HSK 3 Learner',
} as const;

export function ProfilePage() {
  return (
    <>
      <header
        className="border-b border-surface-container bg-surface-container-lowest"
        role="banner"
      >
        <p className="m-0 px-margin-mobile py-stack-md text-headline-md text-primary">Profile</p>
      </header>
      <main
        className="mx-auto flex w-full max-w-lg flex-col gap-stack-lg px-margin-mobile py-stack-lg"
        id="main-content"
        tabIndex={-1}
      >
        <ProfileHeader profile={PROFILE_PLACEHOLDER} />
        <ProfileMenu />
      </main>
    </>
  );
}
