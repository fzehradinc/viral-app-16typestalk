/**
 * Quran Store — sure listesi, okuyucu verisi ve bookmark yönetimi.
 */

import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  fetchSurahList,
  fetchSurahWithTranslation,
} from '../services/quranService';
import type {AppLanguage, SurahSummary, SurahWithTranslation} from '../types';

const BOOKMARKS_KEY = '@noorbloom/quran_bookmarks';

interface QuranState {
  surahList: SurahSummary[];
  isLoadingSurahList: boolean;
  currentSurah: SurahWithTranslation | null;
  isLoadingReader: boolean;
  lastError: string | null;
  bookmarkedAyahs: number[];

  loadSurahList: () => Promise<void>;
  loadSurah: (surahNumber: number, language: AppLanguage) => Promise<void>;
  toggleBookmark: (globalAyahNumber: number) => void;
  initialize: () => Promise<void>;
}

export const useQuranStore = create<QuranState>((set, get) => ({
  surahList: [],
  isLoadingSurahList: false,
  currentSurah: null,
  isLoadingReader: false,
  lastError: null,
  bookmarkedAyahs: [],

  loadSurahList: async () => {
    if (get().surahList.length > 0) {
      return;
    }

    set({isLoadingSurahList: true, lastError: null});

    try {
      const list = await fetchSurahList();
      set({surahList: list, isLoadingSurahList: false});
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load surah list';
      set({isLoadingSurahList: false, lastError: message});
    }
  },

  loadSurah: async (surahNumber, language) => {
    set({isLoadingReader: true, lastError: null});

    try {
      const data = await fetchSurahWithTranslation(surahNumber, language);
      set({currentSurah: data, isLoadingReader: false});
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to load surah';
      set({isLoadingReader: false, lastError: message});
    }
  },

  toggleBookmark: (globalAyahNumber) => {
    const current = get().bookmarkedAyahs;
    const next = current.includes(globalAyahNumber)
      ? current.filter(n => n !== globalAyahNumber)
      : [...current, globalAyahNumber];

    set({bookmarkedAyahs: next});
    AsyncStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
  },

  initialize: async () => {
    try {
      const raw = await AsyncStorage.getItem(BOOKMARKS_KEY);
      if (raw) {
        const parsed: number[] = JSON.parse(raw);
        set({bookmarkedAyahs: parsed});
      }
    } catch {
      // Bookmark verisi bozuksa sıfırdan başla
    }
  },
}));
