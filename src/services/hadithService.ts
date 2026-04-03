/**
 * Hadis servisi — HadeethEnc API ile günlük hadis çekme.
 * Swift HadithService ile aynı endpoint.
 */

import type {HadithData} from '../types';

const HADEETH_BASE = 'https://hadeethenc.com/api/v1/hadeeths/one';

const LANGUAGE_MAP: Record<string, string> = {
  tr: 'tr',
  en: 'en',
  ru: 'ru',
};

/**
 * Verilen dilde rastgele bir hadis döndürür.
 * API günün tarihine göre deterministik bir hadis seçer.
 * Hata durumunda null döner.
 */
export async function fetchDailyHadith(
  language: 'tr' | 'en' | 'ru',
): Promise<HadithData | null> {
  try {
    const lang = LANGUAGE_MAP[language] || 'en';
    const today = new Date();
    const dayOfYear =
      Math.floor(
        (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
          86400000,
      );
    const hadithId = (dayOfYear % 500) + 1;

    const url = `${HADEETH_BASE}/?language=${lang}&id=${hadithId}`;
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data: Record<string, string> = await response.json();

    return {
      hadeeth: data.hadeeth || '',
      attribution: data.attribution || '',
      language: lang,
    };
  } catch {
    return null;
  }
}
