/**
 * AI store — affirmation üretimi, günlük limit kontrolü, AsyncStorage cache.
 * subscriptionStore ile entegre çalışır.
 */

import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import {generateAffirmation} from '../services/aiService';
import {useSubscriptionStore} from './subscriptionStore';
import type {AppLanguage} from '../types';

const AFFIRMATION_KEY = '@noorbloom/dailyAffirmation';
const AFFIRMATION_DATE_KEY = '@noorbloom/affirmationDate';
const MOOD_KEY = '@noorbloom/dailyMood';

interface AiState {
  isGenerating: boolean;
  lastError: string | null;
  dailyAffirmation: string;
  lastAffirmationDate: string;
  savedDailyMood: string;
  generateAndSaveAffirmation: (
    mood: string,
    language: AppLanguage,
  ) => Promise<void>;
  loadSavedAffirmation: () => Promise<void>;
}

function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export const useAiStore = create<AiState>((set) => ({
  isGenerating: false,
  lastError: null,
  dailyAffirmation: '',
  lastAffirmationDate: '',
  savedDailyMood: '',

  generateAndSaveAffirmation: async (
    mood: string,
    language: AppLanguage,
  ) => {
    const subStore = useSubscriptionStore.getState();

    if (!subStore.canUseFeature()) {
      set({lastError: 'dailyLimitReached'});
      return;
    }

    set({isGenerating: true, lastError: null});

    try {
      const result = await generateAffirmation(mood, language);

      if (!result) {
        set({isGenerating: false, lastError: 'generationFailed'});
        return;
      }

      const today = todayString();

      set({
        dailyAffirmation: result,
        lastAffirmationDate: today,
        savedDailyMood: mood,
        isGenerating: false,
      });

      await subStore.incrementUsage();

      await Promise.all([
        AsyncStorage.setItem(AFFIRMATION_KEY, result),
        AsyncStorage.setItem(AFFIRMATION_DATE_KEY, today),
        AsyncStorage.setItem(MOOD_KEY, mood),
      ]);
    } catch {
      set({isGenerating: false, lastError: 'generationFailed'});
    }
  },

  loadSavedAffirmation: async () => {
    try {
      const [stored, storedDate, storedMood] = await Promise.all([
        AsyncStorage.getItem(AFFIRMATION_KEY),
        AsyncStorage.getItem(AFFIRMATION_DATE_KEY),
        AsyncStorage.getItem(MOOD_KEY),
      ]);

      const today = todayString();

      if (storedDate === today && stored) {
        set({
          dailyAffirmation: stored,
          lastAffirmationDate: today,
          savedDailyMood: storedMood || '',
        });
      } else {
        set({
          dailyAffirmation: '',
          lastAffirmationDate: '',
          savedDailyMood: '',
        });
      }
    } catch {
      set({dailyAffirmation: '', lastAffirmationDate: '', savedDailyMood: ''});
    }
  },
}));
