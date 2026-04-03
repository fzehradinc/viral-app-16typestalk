/**
 * Dua Store — AI dua üretimi, kaydetme, limit yönetimi.
 */

import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';
import {generateDua} from '../services/aiService';
import {useSubscriptionStore} from './subscriptionStore';
import type {AppLanguage, SavedDua} from '../types';

const SAVED_DUAS_KEY = '@noorbloom/savedDuas';
const DUA_USAGE_KEY = '@noorbloom/duaUsageToday';
const DUA_DATE_KEY = '@noorbloom/lastDuaDate';
const FREE_DUA_LIMIT = 2;

interface DuaState {
  recipientName: string;
  intention: string;
  generatedDua: string | null;
  isGenerating: boolean;
  lastError: string | null;
  savedDuas: SavedDua[];
  duaUsageToday: number;
  lastDuaDate: string;

  setRecipientName: (name: string) => void;
  setIntention: (intention: string) => void;
  generateDuaAction: (language: AppLanguage) => Promise<void>;
  canGenerateDua: () => boolean;
  saveDua: (dua: string, name: string, language: AppLanguage) => void;
  deleteDua: (id: string) => void;
  initialize: () => Promise<void>;
}

function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export const useDuaStore = create<DuaState>((set, get) => ({
  recipientName: '',
  intention: '',
  generatedDua: null,
  isGenerating: false,
  lastError: null,
  savedDuas: [],
  duaUsageToday: 0,
  lastDuaDate: '',

  setRecipientName: (name: string) => {
    set({recipientName: name});
  },

  setIntention: (intention: string) => {
    set({intention});
  },

  canGenerateDua: () => {
    const state = get();
    const subStore = useSubscriptionStore.getState();

    if (subStore.isPro) {
      return true;
    }

    const today = todayString();
    if (state.lastDuaDate !== today) {
      return true;
    }

    return state.duaUsageToday < FREE_DUA_LIMIT;
  },

  generateDuaAction: async (language: AppLanguage) => {
    const state = get();

    if (!state.canGenerateDua()) {
      set({lastError: 'dailyLimitReached'});
      return;
    }

    set({isGenerating: true, lastError: null});

    try {
      const result = await generateDua(
        state.recipientName,
        state.intention,
        language,
      );

      if (!result) {
        set({isGenerating: false, lastError: 'generationFailed'});
        return;
      }

      const today = todayString();
      const newUsage =
        state.lastDuaDate === today ? state.duaUsageToday + 1 : 1;

      set({
        generatedDua: result,
        isGenerating: false,
        duaUsageToday: newUsage,
        lastDuaDate: today,
      });

      await Promise.all([
        AsyncStorage.setItem(DUA_USAGE_KEY, String(newUsage)),
        AsyncStorage.setItem(DUA_DATE_KEY, today),
      ]);
    } catch {
      set({isGenerating: false, lastError: 'generationFailed'});
    }
  },

  saveDua: (dua: string, name: string, language: AppLanguage) => {
    const newDua: SavedDua = {
      id: generateId(),
      recipientName: name,
      intention: get().intention,
      dua,
      createdAt: new Date().toISOString(),
      language,
    };

    const updated = [newDua, ...get().savedDuas];
    set({savedDuas: updated});
    AsyncStorage.setItem(SAVED_DUAS_KEY, JSON.stringify(updated));
  },

  deleteDua: (id: string) => {
    const updated = get().savedDuas.filter(d => d.id !== id);
    set({savedDuas: updated});
    AsyncStorage.setItem(SAVED_DUAS_KEY, JSON.stringify(updated));
  },

  initialize: async () => {
    try {
      const [rawDuas, rawUsage, rawDate] = await Promise.all([
        AsyncStorage.getItem(SAVED_DUAS_KEY),
        AsyncStorage.getItem(DUA_USAGE_KEY),
        AsyncStorage.getItem(DUA_DATE_KEY),
      ]);

      const savedDuas: SavedDua[] = rawDuas ? JSON.parse(rawDuas) : [];
      const today = todayString();
      const isToday = rawDate === today;
      const duaUsageToday =
        isToday && rawUsage ? parseInt(rawUsage, 10) : 0;

      set({savedDuas, duaUsageToday, lastDuaDate: isToday ? today : ''});

      if (!isToday && rawDate) {
        await AsyncStorage.setItem(DUA_USAGE_KEY, '0');
        await AsyncStorage.setItem(DUA_DATE_KEY, today);
      }
    } catch {
      // Veri bozuksa sıfırdan başla
    }
  },
}));
