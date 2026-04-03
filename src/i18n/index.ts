import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

import tr from './tr.json';
import en from './en.json';
import ru from './ru.json';

const LANGUAGE_STORAGE_KEY = '@noorbloom/language';

const resources = {
  tr: {translation: tr},
  en: {translation: en},
  ru: {translation: ru},
};

type SupportedLanguage = 'tr' | 'en' | 'ru';

const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['tr', 'en', 'ru'];

/**
 * Cihaz dilini algılayıp desteklenen diller arasında eşleştirir.
 * Eşleşme yoksa varsayılan olarak "en" döner.
 */
function getDeviceLanguage(): SupportedLanguage {
  const locales = RNLocalize.getLocales();
  if (locales.length > 0) {
    const deviceLang = locales[0].languageCode as SupportedLanguage;
    if (SUPPORTED_LANGUAGES.includes(deviceLang)) {
      return deviceLang;
    }
  }
  return 'en';
}

/**
 * AsyncStorage'dan kaydedilmiş dil tercihini okur.
 * Kayıt yoksa cihaz dilini döndürür.
 */
async function getStoredLanguage(): Promise<SupportedLanguage> {
  const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored && SUPPORTED_LANGUAGES.includes(stored as SupportedLanguage)) {
    return stored as SupportedLanguage;
  }
  return getDeviceLanguage();
}

/**
 * i18next'i başlatır.
 * Uygulama açılışında App.tsx içinden çağrılmalıdır.
 */
export async function initI18n(): Promise<void> {
  const language = await getStoredLanguage();

  await i18next.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

/**
 * Dil değiştiğinde hem i18next'i güncelleyip hem de
 * tercihi AsyncStorage'a kaydeder.
 */
export async function changeLanguage(lang: SupportedLanguage): Promise<void> {
  await i18next.changeLanguage(lang);
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
}

/**
 * i18n başlatma stratejisi:
 * 1. react-native-localize ile cihaz dili algılanır.
 * 2. AsyncStorage'da kayıtlı tercih varsa o kullanılır (kullanıcı seçimi > cihaz).
 * 3. Varsayılan (fallback) her zaman İngilizce'dir.
 * 4. Nested JSON yapısı kullanılır; tek "translation" namespace'i yeterlidir.
 * 5. Tip güvenli useTranslation hook'u src/hooks/useTranslation.ts içinden sağlanır.
 */
