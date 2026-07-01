import type { ReactNode } from 'react';

import { TopAppBar } from '@/components/navigation/TopAppBar';
import { cn } from '@/utils';

type FeaturePageShellProps = {
  title: string;
  backTo: string;
  children: ReactNode;
  maxWidth?: 'md' | 'lg';
  className?: string;
};

const maxWidthClassNames = {
  md: 'max-w-md',
  lg: 'max-w-lg',
} as const;

export function FeaturePageShell({
  title,
  backTo,
  children,
  maxWidth = 'lg',
  className,
}: FeaturePageShellProps) {
  return (
    <>
      <TopAppBar backTo={backTo} title={title} />
      <main
        className={cn(
          'mx-auto w-full px-margin-mobile py-stack-lg sm:px-6',
          maxWidthClassNames[maxWidth],
          'page-enter',
          className,
        )}
        id="main-content"
        tabIndex={-1}
      >
        {children}
      </main>
    </>
  );
}

export type { FeaturePageShellProps };
