import {useTranslation as useI18nextTranslation} from 'react-i18next';
import {useLanguageStore} from '../store/languageStore';
import type {AppLanguage} from '../types';
import type en from '../i18n/en.json';

/**
 * Nested JSON key'lerini dot-notation string'e dönüştüren
 * recursive utility tipi.
 * Örnek: { nav: { home: "..." } } → "nav.home"
 */
type NestedKeys<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? NestedKeys<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

/** en.json yapısından üretilmiş tüm çeviri key'leri */
export type TranslationKey = NestedKeys<typeof en>;

/**
 * Tip güvenli useTranslation hook'u.
 *
 * i18next'in native hook'unu wrap eder ve aşağıdakileri sağlar:
 * - t() fonksiyonu: key autocomplete destekli
 * - currentLanguage: languageStore ile senkron
 */
export function useTranslation() {
  const {t, i18n} = useI18nextTranslation();
  const currentLanguage = useLanguageStore(s => s.currentLanguage);

  return {
    t: t as (key: TranslationKey, options?: Record<string, unknown>) => string,
    currentLanguage: (i18n.language || currentLanguage) as AppLanguage,
  };
}

/**
 * Neden wrap ediyoruz:
 * 1. TranslationKey tipi sayesinde t('nav.home') gibi key'lerde IDE autocomplete çalışır.
 * 2. currentLanguage hem i18next hem languageStore'dan alınır — her zaman güncel.
 * 3. İmport yolu kısa: import { useTranslation } from '@/hooks/useTranslation'
 */
