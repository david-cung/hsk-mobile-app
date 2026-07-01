export type ProfileHeaderData = {
  email: string;
  initials: string;
  name: string;
  subtitle?: string;
};

type ProfileHeaderProps = {
  profile: ProfileHeaderData;
};

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <section
      aria-labelledby="profile-name-heading"
      className="flex flex-col items-center gap-stack-sm text-center"
    >
      <div
        aria-hidden="true"
        className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-surface-container-lowest bg-primary-fixed text-headline-md font-semibold text-on-primary-fixed shadow-card"
      >
        {profile.initials}
      </div>
      <div>
        <h1 className="m-0 text-headline-lg-mobile text-on-surface" id="profile-name-heading">
          {profile.name}
        </h1>
        <p className="m-0 mt-1 text-label-md text-on-surface-variant">{profile.email}</p>
        {profile.subtitle ? (
          <p className="m-0 mt-1 text-label-md text-on-surface-variant">{profile.subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}

export type { ProfileHeaderProps };
