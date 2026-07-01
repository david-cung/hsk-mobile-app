import type { ReactNode } from 'react';

import { cn } from '@/utils';

type StaggerListProps = {
  children: ReactNode;
  className?: string;
  as?: 'ul' | 'ol' | 'div';
};

export function StaggerList({ children, className, as: Component = 'ul' }: StaggerListProps) {
  return <Component className={cn('m-0 list-none p-0', className)}>{children}</Component>;
}

type StaggerItemProps = {
  children: ReactNode;
  index: number;
  className?: string;
  as?: 'li' | 'div';
};

export function StaggerItem({
  children,
  index,
  className,
  as: Component = 'li',
}: StaggerItemProps) {
  return (
    <Component
      className={cn('stagger-item', className)}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {children}
    </Component>
  );
}

export type { StaggerItemProps, StaggerListProps };
