import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { NativeModules, Platform } from 'react-native';
import * as Keychain from 'react-native-keychain';

import {
  DEFAULT_LANGUAGE,
  getLanguageLocale,
  isLanguageCode,
  LanguageCode,
  normalizeLanguageCode,
} from './languages';
import { resources, TranslationKey, TranslationParams } from './translations';

const LANGUAGE_SERVICE = 'hsk_language_preference';

type Translate = (
  key: TranslationKey,
  params?: TranslationParams,
  fallback?: string,
) => string;

interface I18nContextValue {
  language: LanguageCode;
  isLoading: boolean;
  t: Translate;
  setLanguage: (language: LanguageCode) => Promise<void>;
  formatDate: (date: Date | string | number) => string;
  formatNumber: (value: number) => string;
  formatPercent: (value: number) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function interpolate(template: string, params?: TranslationParams) {
  if (!params) {
    return template;
  }

  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    params[key] == null ? '' : String(params[key]),
  );
}

function getDeviceLocale() {
  const modules = NativeModules as Record<string, unknown>;
  if (Platform.OS === 'ios') {
    const settingsManager = modules.SettingsManager as
      | { settings?: Record<string, unknown> }
      | undefined;
    const settings = settingsManager?.settings;
    const appleLanguages = settings?.AppleLanguages;
    if (Array.isArray(appleLanguages) && typeof appleLanguages[0] === 'string') {
      return appleLanguages[0];
    }
    const appleLocale = settings?.AppleLocale;
    return typeof appleLocale === 'string' ? appleLocale : null;
  }

  const i18nManager = modules.I18nManager as
    | { localeIdentifier?: string }
    | undefined;
  return i18nManager?.localeIdentifier ?? null;
}

async function readStoredLanguage() {
  try {
    const credentials = await Keychain.getGenericPassword({
      service: LANGUAGE_SERVICE,
    });
    if (credentials && typeof credentials !== 'boolean') {
      return normalizeLanguageCode(credentials.password);
    }
  } catch {
    return null;
  }

  return null;
}

async function persistLanguage(language: LanguageCode) {
  await Keychain.setGenericPassword('language', language, {
    service: LANGUAGE_SERVICE,
  });
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function initialize() {
      const stored = await readStoredLanguage();
      const detected = normalizeLanguageCode(getDeviceLocale());
      if (mounted) {
        setLanguageState(stored ?? detected ?? DEFAULT_LANGUAGE);
        setIsLoading(false);
      }
    }

    initialize();

    return () => {
      mounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (nextLanguage: LanguageCode) => {
    if (!isLanguageCode(nextLanguage)) {
      return;
    }
    setLanguageState(nextLanguage);
    await persistLanguage(nextLanguage);
  }, []);

  const t = useCallback<Translate>(
    (key, params, fallback) => {
      const template = resources[language][key] ?? resources.en[key] ?? fallback ?? key;
      return interpolate(template, params);
    },
    [language],
  );

  const locale = getLanguageLocale(language);
  const value = useMemo<I18nContextValue>(
    () => ({
      language,
      isLoading,
      t,
      setLanguage,
      formatDate: date =>
        new Intl.DateTimeFormat(locale, {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }).format(new Date(date)),
      formatNumber: number => new Intl.NumberFormat(locale).format(number),
      formatPercent: number =>
        new Intl.NumberFormat(locale, {
          style: 'percent',
          maximumFractionDigits: 0,
        }).format(number / 100),
    }),
    [isLoading, language, locale, setLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const value = useContext(I18nContext);
  if (!value) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return value;
}
