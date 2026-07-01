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
