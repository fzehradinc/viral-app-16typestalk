/**
 * Reflection store — günlük tefekkür girdileri yönetimi.
 * SQLite (op-sqlite) ile kalıcı depolama.
 */

import {create} from 'zustand';
import {format} from 'date-fns';
import * as databaseService from '../services/databaseService';
import * as aiService from '../services/aiService';
import {useSubscriptionStore} from './subscriptionStore';
import {useStreakStore} from './streakStore';
import type {AppLanguage, ReflectionEntry} from '../types';

function todayString(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function generateId(): string {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

interface ReflectionState {
  todayEntry: ReflectionEntry | null;
  allEntries: ReflectionEntry[];
  isGenerating: boolean;
  lastError: string | null;
  selectedDate: string;
  initialize: () => void;
  loadTodayEntry: () => void;
  loadAllEntries: () => void;
  saveEntry: (
    topic: string,
    content: string,
    language: AppLanguage,
    mood?: string,
  ) => ReflectionEntry;
  generateAndSaveReflection: (
    topic: string,
    content: string,
    language: AppLanguage,
    mood?: string,
  ) => Promise<void>;
  deleteEntry: (id: string) => void;
  setSelectedDate: (date: string) => void;
}

export const useReflectionStore = create<ReflectionState>((set, get) => ({
  todayEntry: null,
  allEntries: [],
  isGenerating: false,
  lastError: null,
  selectedDate: todayString(),

  initialize: () => {
    databaseService.initDatabase();
    get().loadTodayEntry();
    get().loadAllEntries();
  },

  loadTodayEntry: () => {
    const today = todayString();
    const entry = databaseService.getReflectionByDate(today);
    set({todayEntry: entry});
  },

  loadAllEntries: () => {
    const entries = databaseService.getAllReflections();
    set({allEntries: entries});
  },

  saveEntry: (
    topic: string,
    content: string,
    language: AppLanguage,
    mood?: string,
  ): ReflectionEntry => {
    const today = todayString();
    const existing = get().todayEntry;

    const entry: ReflectionEntry = {
      id: existing?.id ?? generateId(),
      date: today,
      topic,
      content,
      aiReflection: existing?.aiReflection ?? null,
      mood: mood || null,
      language,
      createdAt: existing?.createdAt ?? new Date().toISOString(),
    };

    databaseService.saveReflection(entry);
    set({todayEntry: entry});
    get().loadAllEntries();
    useStreakStore.getState().recordActivity('reflection');

    return entry;
  },

  generateAndSaveReflection: async (
    topic: string,
    content: string,
    language: AppLanguage,
    mood?: string,
  ): Promise<void> => {
    const subscriptionStore = useSubscriptionStore.getState();
    if (!subscriptionStore.canUseFeature()) {
      set({lastError: 'Daily AI limit reached. Upgrade for unlimited.'});
      return;
    }

    const entry = get().saveEntry(topic, content, language, mood);

    set({isGenerating: true, lastError: null});

    try {
      const aiReflection = await aiService.generateReflection(
        topic,
        content,
        language,
      );

      if (aiReflection) {
        const updatedEntry: ReflectionEntry = {
          ...entry,
          aiReflection,
        };
        databaseService.saveReflection(updatedEntry);
        set({todayEntry: updatedEntry});
        get().loadAllEntries();
        await subscriptionStore.incrementUsage();
      } else {
        set({lastError: 'Could not generate reflection. Please try again.'});
      }
    } catch {
      set({lastError: 'An error occurred. Please try again.'});
    } finally {
      set({isGenerating: false});
    }
  },

  deleteEntry: (id: string) => {
    databaseService.deleteReflection(id);
    get().loadAllEntries();

    const today = todayString();
    const current = get().todayEntry;
    if (current?.id === id) {
      set({todayEntry: null});
    } else {
      const entry = databaseService.getReflectionByDate(today);
      set({todayEntry: entry});
    }
  },

  setSelectedDate: (date: string) => {
    set({selectedDate: date});
  },
}));
