/**
 * Ayet store — günlük motivasyonel ayet, cache ve fallback.
 * API hata verirse staticContent'ten statik ayet kullanır.
 */

import {create} from 'zustand';
import {format} from 'date-fns';
import {fetchRandomAyahWithTranslations} from '../services/quranService';
import {STATIC_VERSES} from '../utils/staticContent';
import type {AppLanguage, MotivationalQuranic} from '../types';

interface VerseState {
  dailyVerse: MotivationalQuranic | null;
  isLoading: boolean;
  lastFetchDate: string;
  fetchDailyVerse: (language: AppLanguage) => Promise<void>;
  loadRandomVerse: () => Promise<void>;
}

function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function getStaticVerse(): MotivationalQuranic {
  const dayOfYear = Math.floor(
    (new Date().getTime() -
      new Date(new Date().getFullYear(), 0, 0).getTime()) /
      86400000,
  );
  return STATIC_VERSES[dayOfYear % STATIC_VERSES.length];
}

export const useVerseStore = create<VerseState>((set, get) => ({
  dailyVerse: null,
  isLoading: false,
  lastFetchDate: '',

  fetchDailyVerse: async (_language: AppLanguage) => {
    const state = get();
    const today = todayString();

    if (state.lastFetchDate === today && state.dailyVerse !== null) {
      return;
    }

    set({isLoading: true});

    try {
      const result = await fetchRandomAyahWithTranslations();
      const verse: MotivationalQuranic = {
        id: result.arabic.number,
        arabic: result.arabic.text,
        translation: result.english.text,
        translationTurkish: result.turkish.text,
        translationRussian: result.russian.text,
        surah: result.arabic.surah.englishName,
        ayah: `${result.arabic.surah.number}:${result.arabic.numberInSurah}`,
      };

      set({dailyVerse: verse, isLoading: false, lastFetchDate: today});
    } catch {
      set({dailyVerse: getStaticVerse(), isLoading: false, lastFetchDate: today});
    }
  },

  loadRandomVerse: async () => {
    set({isLoading: true});

    try {
      const result = await fetchRandomAyahWithTranslations();
      const verse: MotivationalQuranic = {
        id: result.arabic.number,
        arabic: result.arabic.text,
        translation: result.english.text,
        translationTurkish: result.turkish.text,
        translationRussian: result.russian.text,
        surah: result.arabic.surah.englishName,
        ayah: `${result.arabic.surah.number}:${result.arabic.numberInSurah}`,
      };

      set({dailyVerse: verse, isLoading: false});
    } catch {
      set({dailyVerse: getStaticVerse(), isLoading: false});
    }
  },
}));
