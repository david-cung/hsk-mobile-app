import { en, TranslationKey } from './translations';

type Translate = (key: TranslationKey, params?: Record<string, string | number>, fallback?: string) => string;

export function getLessonTypeLabel(type: string | null | undefined, t: Translate) {
  if (!type) {
    return '';
  }

  const key = `lessonType.${type}` as TranslationKey;
  if (key in en) {
    return t(key);
  }

  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}

export function getWordTypeLabel(type: string | null | undefined, t: Translate) {
  if (!type) {
    return '';
  }

  const normalized = type.trim().toLowerCase().replace(/\s+/g, '_');
  const key = `wordType.${normalized}` as TranslationKey;
  if (key in en) {
    return t(key);
  }

  return type
    .replace(/_/g, ' ')
    .replace(/\b\w/g, character => character.toUpperCase());
}
