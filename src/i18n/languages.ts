export const SUPPORTED_LANGUAGES = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    locale: 'en-US',
  },
  {
    code: 'vi',
    name: 'Vietnamese',
    nativeName: 'Tiếng Việt',
    locale: 'vi-VN',
  },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'en';

export function isLanguageCode(value: unknown): value is LanguageCode {
  return SUPPORTED_LANGUAGES.some(language => language.code === value);
}

export function normalizeLanguageCode(value?: string | null): LanguageCode | null {
  if (!value) {
    return null;
  }

  const normalized = value.replace('_', '-').split('-')[0]?.toLowerCase();
  return isLanguageCode(normalized) ? normalized : null;
}

export function getLanguageLocale(language: LanguageCode) {
  return SUPPORTED_LANGUAGES.find(item => item.code === language)?.locale ?? 'en-US';
}
