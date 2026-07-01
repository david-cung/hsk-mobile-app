import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils';

export type TextVariant = 'display' | 'body' | 'label';

type TextElement = 'div' | 'h1' | 'h2' | 'p' | 'span';

type TextProps = {
  as?: TextElement;
  variant?: TextVariant;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

const textVariantStyles: Record<TextVariant, string> = {
  display: 'text-headline-lg-mobile',
  body: 'text-body-md',
  label: 'text-label-md',
};

const defaultTextElements: Record<TextVariant, TextElement> = {
  display: 'h2',
  body: 'p',
  label: 'span',
};

export const Text = forwardRef<HTMLElement, TextProps>(function Text(
  { as, variant = 'body', className, children, ...props },
  ref,
) {
  const Component = as ?? defaultTextElements[variant];

  return createElement(
    Component,
    {
      ...props,
      className: cn(textVariantStyles[variant], className),
      ref,
    },
    children,
  );
});

export type { TextProps };
