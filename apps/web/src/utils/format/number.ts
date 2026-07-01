export type FormatPercentOptions = {
  locale?: Intl.LocalesArgument;
  maximumFractionDigits?: number;
  minimumFractionDigits?: number;
};

export function formatPercent(value: number, options: FormatPercentOptions = {}): string {
  const { locale, maximumFractionDigits = 0, minimumFractionDigits = 0 } = options;

  return new Intl.NumberFormat(locale, {
    style: 'percent',
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);
}

/** Formats a 0–100 score as a localized percent string (e.g. 92 → "92%"). */
export function formatScorePercent(
  scorePercent: number,
  options: FormatPercentOptions = {},
): string {
  return formatPercent(scorePercent / 100, options);
}

export function formatCountLabel(count: number, singular: string, plural: string): string {
  return count === 1 ? `1 ${singular}` : `${count} ${plural}`;
}
