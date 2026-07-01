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
