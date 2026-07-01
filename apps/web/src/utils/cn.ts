import { type ClassValue, clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      spacing: [
        'margin-mobile',
        'gutter-mobile',
        'stack-sm',
        'stack-md',
        'stack-lg',
        'card-padding',
        'unit',
      ],
    },
    classGroups: {
      'font-size': [
        {
          text: [
            'display-zh',
            'headline-lg',
            'headline-lg-mobile',
            'headline-md',
            'body-lg',
            'body-md',
            'body-zh',
            'label-md',
            'label-sm',
          ],
        },
      ],
    },
  },
});

/**
 * Merges class names with conditional support and Tailwind conflict resolution.
 *
 * @example
 * cn('px-4 py-2', isActive && 'bg-primary', 'px-margin-mobile')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
