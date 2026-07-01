import { FocusAreaGrid } from '../components/FocusAreaGrid';
import { HomeHeader } from '../components/HomeHeader';
import { StatsBento } from '../components/StatsBento';

export function HomePage() {
  return (
    <>
      <HomeHeader />
      <main
        className="mx-auto flex w-full max-w-lg flex-col gap-stack-lg px-margin-mobile pb-stack-lg md:pb-12"
        id="main-content"
        tabIndex={-1}
      >
        <StatsBento />
        <FocusAreaGrid />
      </main>
    </>
  );
}
