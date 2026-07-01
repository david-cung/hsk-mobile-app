function NotificationIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-6 w-6"
      fill="none"
      height="24"
      viewBox="0 0 24 24"
      width="24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22ZM18 16v-5a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function HomeHeader() {
  return (
    <section
      aria-labelledby="home-greeting-heading"
      className="flex items-center justify-between gap-stack-md px-margin-mobile pb-stack-lg pt-stack-md"
    >
      <div className="min-w-0">
        <h1 className="m-0 text-headline-lg-mobile text-on-surface" id="home-greeting-heading">
          Good morning, Learner
        </h1>
        <p className="m-0 mt-1 text-label-md text-on-surface-variant">
          Ready for your daily practice?
        </p>
      </div>
      <button
        aria-label="Notifications"
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container text-on-surface-variant shadow-card ring-focus focus-visible:outline-none focus-visible:ring-[3px]"
        type="button"
      >
        <NotificationIcon />
      </button>
    </section>
  );
}
