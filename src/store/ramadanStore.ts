/**
 * Ramadan store — oruç/Teravih takibi, hatırlatıcı toggle'ları.
 * AsyncStorage ile kalıcı veri, Zustand ile reaktif state.
 */

import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {RamadanData, RamadanDay, FastingStatus} from '../types';

const STORAGE_KEY = '@noorbloom/ramadanData';

interface RamadanStats {
  totalFasted: number;
  totalMissed: number;
  totalTarawih: number;
}

interface RamadanState {
  ramadanData: RamadanData | null;
  isLoading: boolean;
  currentDayNumber: number | null;
  initialize: () => Promise<void>;
  updateDayStatus: (dayNumber: number, status: FastingStatus) => Promise<void>;
  toggleTarawih: (dayNumber: number) => Promise<void>;
  toggleIftarReminder: (enabled: boolean) => Promise<void>;
  toggleSuhoorReminder: (enabled: boolean) => Promise<void>;
  toggleTarawihReminder: (enabled: boolean) => Promise<void>;
  getStats: () => RamadanStats;
}

function createEmptyRamadanData(year: number): RamadanData {
  const days: RamadanDay[] = Array.from({length: 30}, (_, i) => ({
    dayNumber: i + 1,
    date: '',
    fastingStatus: 'pending' as FastingStatus,
    tarawihCompleted: false,
  }));

  return {
    year,
    days,
    iftarReminderEnabled: false,
    suhoorReminderEnabled: false,
    tarawihReminderEnabled: false,
  };
}

function computeCurrentDay(): number | null {
  // Basit yaklaşım: Ramazan 2026 yaklaşık 17 Şubat — 18 Mart arası
  // Gerçek Hicri takvim hesabı karmaşık, basit versiyon yeterli
  const now = new Date();
  const ramadanStart = new Date(2026, 1, 17); // 17 Feb 2026
  const ramadanEnd = new Date(2026, 2, 19); // 19 Mar 2026

  if (now >= ramadanStart && now <= ramadanEnd) {
    const diffMs = now.getTime() - ramadanStart.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.min(diffDays, 30);
  }
  return null;
}

async function persist(data: RamadanData): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export const useRamadanStore = create<RamadanState>((set, get) => ({
  ramadanData: null,
  isLoading: true,
  currentDayNumber: null,

  initialize: async () => {
    try {
      set({isLoading: true});
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      const currentYear = new Date().getFullYear();

      if (stored) {
        const parsed: RamadanData = JSON.parse(stored);
        if (parsed.year === currentYear) {
          set({
            ramadanData: parsed,
            currentDayNumber: computeCurrentDay(),
            isLoading: false,
          });
          return;
        }
      }

      const fresh = createEmptyRamadanData(currentYear);
      await persist(fresh);
      set({
        ramadanData: fresh,
        currentDayNumber: computeCurrentDay(),
        isLoading: false,
      });
    } catch {
      const fresh = createEmptyRamadanData(new Date().getFullYear());
      set({
        ramadanData: fresh,
        currentDayNumber: computeCurrentDay(),
        isLoading: false,
      });
    }
  },

  updateDayStatus: async (dayNumber: number, status: FastingStatus) => {
    const {ramadanData} = get();
    if (!ramadanData) {
      return;
    }

    const updatedDays = ramadanData.days.map(d =>
      d.dayNumber === dayNumber ? {...d, fastingStatus: status} : d,
    );
    const updated: RamadanData = {...ramadanData, days: updatedDays};
    set({ramadanData: updated});
    await persist(updated);
  },

  toggleTarawih: async (dayNumber: number) => {
    const {ramadanData} = get();
    if (!ramadanData) {
      return;
    }

    const updatedDays = ramadanData.days.map(d =>
      d.dayNumber === dayNumber
        ? {...d, tarawihCompleted: !d.tarawihCompleted}
        : d,
    );
    const updated: RamadanData = {...ramadanData, days: updatedDays};
    set({ramadanData: updated});
    await persist(updated);
  },

  toggleIftarReminder: async (enabled: boolean) => {
    const {ramadanData} = get();
    if (!ramadanData) {
      return;
    }

    const updated: RamadanData = {...ramadanData, iftarReminderEnabled: enabled};
    set({ramadanData: updated});
    await persist(updated);
  },

  toggleSuhoorReminder: async (enabled: boolean) => {
    const {ramadanData} = get();
    if (!ramadanData) {
      return;
    }

    const updated: RamadanData = {
      ...ramadanData,
      suhoorReminderEnabled: enabled,
    };
    set({ramadanData: updated});
    await persist(updated);
  },

  toggleTarawihReminder: async (enabled: boolean) => {
    const {ramadanData} = get();
    if (!ramadanData) {
      return;
    }

    const updated: RamadanData = {
      ...ramadanData,
      tarawihReminderEnabled: enabled,
    };
    set({ramadanData: updated});
    await persist(updated);
  },

  getStats: (): RamadanStats => {
    const {ramadanData} = get();
    if (!ramadanData) {
      return {totalFasted: 0, totalMissed: 0, totalTarawih: 0};
    }

    return {
      totalFasted: ramadanData.days.filter(d => d.fastingStatus === 'fasted')
        .length,
      totalMissed: ramadanData.days.filter(d => d.fastingStatus === 'missed')
        .length,
      totalTarawih: ramadanData.days.filter(d => d.tarawihCompleted).length,
    };
  },
}));
