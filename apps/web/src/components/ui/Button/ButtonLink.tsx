import type { ComponentProps } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '@/utils';

import { type ButtonVariant, getButtonClassName } from './button.styles';

type ButtonLinkProps = ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

export function ButtonLink({
  variant = 'primary',
  fullWidth = false,
  className,
  children,
  ...linkProps
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(
        getButtonClassName({ variant, fullWidth }),
        'no-underline ring-focus focus-visible:outline-none focus-visible:ring-[3px]',
        className,
      )}
      {...linkProps}
    >
      {children}
    </Link>
  );
}

export type { ButtonLinkProps };
