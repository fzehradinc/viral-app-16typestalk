/**
 * Hadis store — günlük hadis cache'i ve dil değişim kontrolü.
 * Aynı gün aynı dil için tekrar çekmez.
 */

import {create} from 'zustand';
import {format} from 'date-fns';
import {fetchDailyHadith} from '../services/hadithService';
import type {HadithData} from '../types';

interface HadithState {
  dailyHadith: HadithData | null;
  isLoading: boolean;
  lastFetchDate: string;
  lastFetchLanguage: string;
  fetchHadith: (language: 'tr' | 'en' | 'ru') => Promise<void>;
}

export const useHadithStore = create<HadithState>((set, get) => ({
  dailyHadith: null,
  isLoading: false,
  lastFetchDate: '',
  lastFetchLanguage: '',

  fetchHadith: async (language: 'tr' | 'en' | 'ru') => {
    const state = get();
    const today = format(new Date(), 'yyyy-MM-dd');

    if (
      state.lastFetchDate === today &&
      state.lastFetchLanguage === language &&
      state.dailyHadith !== null
    ) {
      return;
    }

    set({isLoading: true});

    try {
      const hadith = await fetchDailyHadith(language);

      set({
        dailyHadith: hadith,
        isLoading: false,
        lastFetchDate: today,
        lastFetchLanguage: language,
      });
    } catch {
      set({isLoading: false});
    }
  },
}));
