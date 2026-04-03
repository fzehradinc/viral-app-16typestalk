import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import i18next from 'i18next';
import type {AppLanguage} from '../types';

const LANGUAGE_STORAGE_KEY = '@noorbloom/language';
const SUPPORTED: AppLanguage[] = ['tr', 'en', 'ru'];

interface LanguageState {
  currentLanguage: AppLanguage;
  setLanguage: (lang: AppLanguage) => Promise<void>;
  hydrate: () => Promise<void>;
}

/**
 * Sistem dilini algılayıp desteklenen diller arasında eşleştirir.
 */
function detectDeviceLanguage(): AppLanguage {
  const locales = RNLocalize.getLocales();
  if (locales.length > 0) {
    const code = locales[0].languageCode as AppLanguage;
    if (SUPPORTED.includes(code)) {
      return code;
    }
  }
  return 'en';
}

export const useLanguageStore = create<LanguageState>((set) => ({
  currentLanguage: 'en',

  setLanguage: async (lang: AppLanguage) => {
    set({currentLanguage: lang});
    await i18next.changeLanguage(lang);
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  },

  hydrate: async () => {
    const stored = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && SUPPORTED.includes(stored as AppLanguage)) {
      set({currentLanguage: stored as AppLanguage});
    } else {
      const detected = detectDeviceLanguage();
      set({currentLanguage: detected});
    }
  },
}));

/**
 * Zustand + AsyncStorage birleşimi seçildi çünkü:
 * 1. Zustand: minimal API, boilerplate yok, React dışından da erişilebilir.
 * 2. hydrate() fonksiyonu uygulama başlangıcında çağrılır; store ilk değerini alır.
 * 3. setLanguage hem store'u, hem i18next'i, hem de kalıcı depolamayı günceller.
 * 4. İleride MMKV'ye geçiş tek satır değişiklikle mümkün.
 */
