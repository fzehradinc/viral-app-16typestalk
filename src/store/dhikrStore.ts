/**
 * Dhikr store — günlük sayaç, toplam sayaç, gün sıfırlama.
 * Haptic feedback için Vibration API kullanılır.
 */

import {create} from 'zustand';
import {Vibration} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {format} from 'date-fns';

const TODAY_COUNT_KEY = '@noorbloom/dhikrTodayCount';
const ALL_TIME_KEY = '@noorbloom/dhikrAllTime';
const LAST_DATE_KEY = '@noorbloom/dhikrLastDate';

interface DhikrState {
  todayCount: number;
  lastDhikrDate: string;
  allTimeCount: number;
  increment: () => Promise<void>;
  reset: () => Promise<void>;
  resetIfNewDay: () => Promise<void>;
  hydrate: () => Promise<void>;
}

function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

export const useDhikrStore = create<DhikrState>((set, get) => ({
  todayCount: 0,
  lastDhikrDate: todayString(),
  allTimeCount: 0,

  increment: async () => {
    const state = get();
    const newToday = state.todayCount + 1;
    const newAllTime = state.allTimeCount + 1;
    const today = todayString();

    set({
      todayCount: newToday,
      allTimeCount: newAllTime,
      lastDhikrDate: today,
    });

    try {
      Vibration.vibrate(10);
    } catch {
      // silent
    }

    await Promise.all([
      AsyncStorage.setItem(TODAY_COUNT_KEY, String(newToday)),
      AsyncStorage.setItem(ALL_TIME_KEY, String(newAllTime)),
      AsyncStorage.setItem(LAST_DATE_KEY, today),
    ]);
  },

  reset: async () => {
    set({todayCount: 0});
    await AsyncStorage.setItem(TODAY_COUNT_KEY, '0');
  },

  resetIfNewDay: async () => {
    const state = get();
    const today = todayString();

    if (state.lastDhikrDate !== today) {
      set({todayCount: 0, lastDhikrDate: today});
      await AsyncStorage.setItem(TODAY_COUNT_KEY, '0');
      await AsyncStorage.setItem(LAST_DATE_KEY, today);
    }
  },

  hydrate: async () => {
    try {
      const [storedToday, storedAllTime, storedDate] = await Promise.all([
        AsyncStorage.getItem(TODAY_COUNT_KEY),
        AsyncStorage.getItem(ALL_TIME_KEY),
        AsyncStorage.getItem(LAST_DATE_KEY),
      ]);

      const today = todayString();
      const isToday = storedDate === today;

      set({
        todayCount: isToday && storedToday ? parseInt(storedToday, 10) : 0,
        allTimeCount: storedAllTime ? parseInt(storedAllTime, 10) : 0,
        lastDhikrDate: today,
      });

      if (!isToday) {
        await AsyncStorage.setItem(TODAY_COUNT_KEY, '0');
        await AsyncStorage.setItem(LAST_DATE_KEY, today);
      }
    } catch {
      set({todayCount: 0, allTimeCount: 0, lastDhikrDate: todayString()});
    }
  },
}));
