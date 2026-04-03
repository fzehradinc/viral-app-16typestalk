/**
 * Bildirim store — kullanıcı tercihlerini yönetir, bildirim planlaması tetikler.
 * notificationService ile entegre çalışır.
 */

import {create} from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee from '@notifee/react-native';
import {
  requestPermission,
  schedulePrayerNotifications,
  cancelPrayerNotifications,
  scheduleIftarReminder,
  cancelRamadanReminders,
  scheduleSuhoorReminder,
  createChannels,
} from '../services/notificationService';
import type {PrayerTimesData} from '../services/prayerTimesService';
import type {AppLanguage} from '../types';

const PREF_PRAYER = '@noorbloom/prayerRemindersEnabled';
const PREF_DAILY = '@noorbloom/dailyReminderEnabled';
const PREF_IFTAR = '@noorbloom/iftarReminderEnabled';
const PREF_SUHOOR = '@noorbloom/suhoorReminderEnabled';

interface NotificationState {
  isPermissionGranted: boolean;
  prayerRemindersEnabled: boolean;
  dailyReminderEnabled: boolean;
  iftarReminderEnabled: boolean;
  suhoorReminderEnabled: boolean;
  initialize: () => Promise<void>;
  togglePrayerReminders: (
    enabled: boolean,
    prayerTimes: PrayerTimesData,
    language: AppLanguage,
  ) => Promise<void>;
  toggleIftarReminder: (
    enabled: boolean,
    prayerTimes: PrayerTimesData,
    language: AppLanguage,
  ) => Promise<void>;
  toggleSuhoorReminder: (
    enabled: boolean,
    prayerTimes: PrayerTimesData,
    language: AppLanguage,
  ) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  isPermissionGranted: false,
  prayerRemindersEnabled: false,
  dailyReminderEnabled: false,
  iftarReminderEnabled: false,
  suhoorReminderEnabled: false,

  initialize: async () => {
    try {
      await createChannels();

      const settings = await notifee.getNotificationSettings();
      const granted = settings.authorizationStatus >= 1;

      const [prayer, daily, iftar, suhoor] = await Promise.all([
        AsyncStorage.getItem(PREF_PRAYER),
        AsyncStorage.getItem(PREF_DAILY),
        AsyncStorage.getItem(PREF_IFTAR),
        AsyncStorage.getItem(PREF_SUHOOR),
      ]);

      set({
        isPermissionGranted: granted,
        prayerRemindersEnabled: prayer === 'true',
        dailyReminderEnabled: daily === 'true',
        iftarReminderEnabled: iftar === 'true',
        suhoorReminderEnabled: suhoor === 'true',
      });
    } catch {
      // Sessizce başlat — varsayılan false değerleri kalır
    }
  },

  togglePrayerReminders: async (
    enabled: boolean,
    prayerTimes: PrayerTimesData,
    language: AppLanguage,
  ) => {
    if (enabled && !get().isPermissionGranted) {
      const granted = await requestPermission();
      set({isPermissionGranted: granted});
      if (!granted) {
        return;
      }
    }

    if (enabled) {
      await schedulePrayerNotifications(prayerTimes, language);
    } else {
      await cancelPrayerNotifications();
    }

    set({prayerRemindersEnabled: enabled});
    await AsyncStorage.setItem(PREF_PRAYER, enabled ? 'true' : 'false');
  },

  toggleIftarReminder: async (
    enabled: boolean,
    prayerTimes: PrayerTimesData,
    language: AppLanguage,
  ) => {
    if (enabled && !get().isPermissionGranted) {
      const granted = await requestPermission();
      set({isPermissionGranted: granted});
      if (!granted) {
        return;
      }
    }

    if (enabled) {
      await scheduleIftarReminder(prayerTimes.maghrib, language);
    } else {
      await cancelRamadanReminders();
    }

    set({iftarReminderEnabled: enabled});
    await AsyncStorage.setItem(PREF_IFTAR, enabled ? 'true' : 'false');
  },

  toggleSuhoorReminder: async (
    enabled: boolean,
    prayerTimes: PrayerTimesData,
    language: AppLanguage,
  ) => {
    if (enabled && !get().isPermissionGranted) {
      const granted = await requestPermission();
      set({isPermissionGranted: granted});
      if (!granted) {
        return;
      }
    }

    if (enabled) {
      await scheduleSuhoorReminder(prayerTimes.fajr, language);
    } else {
      await cancelRamadanReminders();
    }

    set({suhoorReminderEnabled: enabled});
    await AsyncStorage.setItem(PREF_SUHOOR, enabled ? 'true' : 'false');
  },
}));
