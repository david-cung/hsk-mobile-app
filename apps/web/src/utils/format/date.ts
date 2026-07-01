export type FormatDateOptions = {
  locale?: Intl.LocalesArgument;
} & Intl.DateTimeFormatOptions;

const DEFAULT_DATE_OPTIONS = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
} satisfies Intl.DateTimeFormatOptions;

export function formatDate(isoString: string, options: FormatDateOptions = {}): string {
  const { locale, ...dateTimeOptions } = options;
  const date = new Date(isoString);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString(locale, {
    ...DEFAULT_DATE_OPTIONS,
    ...dateTimeOptions,
  });
}

export type FormatRelativeDateOptions = {
  locale?: Intl.LocalesArgument;
  prefix?: string;
};

export function formatRelativeDate(
  isoString: string,
  { locale, prefix = '' }: FormatRelativeDateOptions = {},
): string {
  const saved = new Date(isoString);

  if (Number.isNaN(saved.getTime())) {
    return '';
  }

  const now = new Date();
  const diffMs = now.getTime() - saved.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    return `${prefix}today`;
  }
  if (diffDays === 1) {
    return `${prefix}yesterday`;
  }
  if (diffDays < 7) {
    return `${prefix}${diffDays} days ago`;
  }
  if (diffDays < 14) {
    return `${prefix}1 week ago`;
  }
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${prefix}${weeks} weeks ago`;
  }

  return formatDate(isoString, { locale, month: 'short', day: 'numeric', year: 'numeric' });
}
