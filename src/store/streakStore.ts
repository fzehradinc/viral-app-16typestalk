/**
 * Streak store — günlük etkinlik serisi, en uzun seri, toplam sayaçlar.
 * Swift StreakManager ile aynı mantık: ardışık gün kontrolü.
 */

import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format, subDays} from 'date-fns';

const STREAK_KEY = '@noorbloom/currentStreak';
const LONGEST_KEY = '@noorbloom/longestStreak';
const LAST_ACTIVE_KEY = '@noorbloom/lastActiveDate';
const TOTAL_REFLECTIONS_KEY = '@noorbloom/totalReflections';
const TOTAL_DUAS_KEY = '@noorbloom/totalDuas';

interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalReflections: number;
  totalDuas: number;
  recordActivity: (type: 'reflection' | 'dua' | 'dhikr') => Promise<void>;
  initialize: () => Promise<void>;
}

function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function yesterdayString(): string {
  return format(subDays(new Date(), 1), 'yyyy-MM-dd');
}

export const useStreakStore = create<StreakState>((set, get) => ({
  currentStreak: 0,
  longestStreak: 0,
  lastActiveDate: '',
  totalReflections: 0,
  totalDuas: 0,

  recordActivity: async (type: 'reflection' | 'dua' | 'dhikr') => {
    const state = get();
    const today = todayString();
    const yesterday = yesterdayString();

    let newStreak = state.currentStreak;
    let newReflections = state.totalReflections;
    let newDuas = state.totalDuas;

    if (type === 'reflection') {
      newReflections += 1;
    } else if (type === 'dua') {
      newDuas += 1;
    }

    if (state.lastActiveDate === today) {
      set({totalReflections: newReflections, totalDuas: newDuas});
    } else if (state.lastActiveDate === yesterday) {
      newStreak += 1;
      const newLongest = Math.max(state.longestStreak, newStreak);
      set({
        currentStreak: newStreak,
        longestStreak: newLongest,
        lastActiveDate: today,
        totalReflections: newReflections,
        totalDuas: newDuas,
      });
    } else {
      newStreak = 1;
      set({
        currentStreak: newStreak,
        longestStreak: Math.max(state.longestStreak, 1),
        lastActiveDate: today,
        totalReflections: newReflections,
        totalDuas: newDuas,
      });
    }

    await Promise.all([
      AsyncStorage.setItem(STREAK_KEY, String(newStreak)),
      AsyncStorage.setItem(
        LONGEST_KEY,
        String(Math.max(get().longestStreak, newStreak)),
      ),
      AsyncStorage.setItem(LAST_ACTIVE_KEY, today),
      AsyncStorage.setItem(TOTAL_REFLECTIONS_KEY, String(newReflections)),
      AsyncStorage.setItem(TOTAL_DUAS_KEY, String(newDuas)),
    ]);
  },

  initialize: async () => {
    try {
      const [streak, longest, lastActive, reflections, duas] =
        await Promise.all([
          AsyncStorage.getItem(STREAK_KEY),
          AsyncStorage.getItem(LONGEST_KEY),
          AsyncStorage.getItem(LAST_ACTIVE_KEY),
          AsyncStorage.getItem(TOTAL_REFLECTIONS_KEY),
          AsyncStorage.getItem(TOTAL_DUAS_KEY),
        ]);

      const today = todayString();
      const yesterday = yesterdayString();
      const storedStreak = streak ? parseInt(streak, 10) : 0;

      let currentStreak = storedStreak;
      if (lastActive !== today && lastActive !== yesterday) {
        currentStreak = 0;
      }

      set({
        currentStreak,
        longestStreak: longest ? parseInt(longest, 10) : 0,
        lastActiveDate: lastActive || '',
        totalReflections: reflections ? parseInt(reflections, 10) : 0,
        totalDuas: duas ? parseInt(duas, 10) : 0,
      });

      if (currentStreak !== storedStreak) {
        await AsyncStorage.setItem(STREAK_KEY, String(currentStreak));
      }
    } catch {
      set({
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: '',
        totalReflections: 0,
        totalDuas: 0,
      });
    }
  },
}));
