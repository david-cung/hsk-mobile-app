import { createElement, forwardRef, type HTMLAttributes, type ReactNode } from 'react';

import { cn } from '@/utils';

export type ChineseTextVariant = 'display' | 'body' | 'label';

type ChineseTextElement = 'div' | 'h2' | 'p' | 'span';

type ChineseTextProps = {
  as?: ChineseTextElement;
  variant?: ChineseTextVariant;
  children: ReactNode;
} & HTMLAttributes<HTMLElement>;

const chineseTextVariantStyles: Record<ChineseTextVariant, string> = {
  display: 'text-display-zh',
  body: 'text-body-zh',
  label: 'font-chinese text-label-md',
};

const defaultChineseTextElements: Record<ChineseTextVariant, ChineseTextElement> = {
  display: 'span',
  body: 'p',
  label: 'span',
};

export const ChineseText = forwardRef<HTMLElement, ChineseTextProps>(function ChineseText(
  { as, variant = 'body', className, children, ...props },
  ref,
) {
  const Component = as ?? defaultChineseTextElements[variant];

  return createElement(
    Component,
    {
      ...props,
      className: cn(chineseTextVariantStyles[variant], className),
      lang: 'zh-Hans',
      ref,
    },
    children,
  );
});

export type { ChineseTextProps };
