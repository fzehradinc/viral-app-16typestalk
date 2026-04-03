/**
 * Bildirim servisi — namaz vakti ve Ramazan bildirimleri.
 * Swift NotificationScheduler.swift'in cross-platform karşılığı.
 */

import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {PrayerTimesData} from './prayerTimesService';
import type {AppLanguage} from '../types';

const PERMISSION_KEY = '@noorbloom/notificationPermission';

// ──────────────────────────────────────────
// Kanal Tanımları (Android zorunlu)
// ──────────────────────────────────────────

const CHANNEL_PRAYER = 'prayer-times';
const CHANNEL_REMINDERS = 'reminders';

export async function createChannels(): Promise<void> {
  if (Platform.OS !== 'android') {
    return;
  }

  await notifee.createChannel({
    id: CHANNEL_PRAYER,
    name: 'Prayer Times',
    importance: AndroidImportance.HIGH,
    sound: 'default',
    vibration: true,
  });

  await notifee.createChannel({
    id: CHANNEL_REMINDERS,
    name: 'Reminders',
    importance: AndroidImportance.DEFAULT,
    sound: 'default',
  });
}

// ──────────────────────────────────────────
// İzin Yönetimi
// ──────────────────────────────────────────

export async function requestPermission(): Promise<boolean> {
  try {
    const settings = await notifee.requestPermission();

    const granted =
      settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL

    await AsyncStorage.setItem(PERMISSION_KEY, granted ? 'true' : 'false');
    return granted;
  } catch {
    return false;
  }
}

// ──────────────────────────────────────────
// Zaman Yardımcısı
// ──────────────────────────────────────────

export function parseTimeToTodayDate(timeStr: string): Date | null {
  const match = /^(\d{2}):(\d{2})$/.exec(timeStr);
  if (!match) {
    return null;
  }

  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);

  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    return null;
  }

  const now = new Date();
  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes,
    0,
  );
  return date;
}

// ──────────────────────────────────────────
// Namaz Bildirimleri — i18n Eşleştirme
// ──────────────────────────────────────────

interface PrayerNotifMeta {
  id: string;
  timeKey: keyof PrayerTimesData;
  titles: Record<AppLanguage, string>;
  bodies: Record<AppLanguage, string>;
}

const PRAYER_META: PrayerNotifMeta[] = [
  {
    id: 'prayer_fajr',
    timeKey: 'fajr',
    titles: {
      tr: 'Namaz Vakti: İmsak',
      en: 'Prayer Time: Fajr',
      ru: 'Время намаза: Фаджр',
    },
    bodies: {
      tr: 'İmsak namazı vakti geldi',
      en: 'It is time for Fajr prayer',
      ru: 'Пришло время намаза Фаджр',
    },
  },
  {
    id: 'prayer_dhuhr',
    timeKey: 'dhuhr',
    titles: {
      tr: 'Namaz Vakti: Öğle',
      en: 'Prayer Time: Dhuhr',
      ru: 'Время намаза: Зухр',
    },
    bodies: {
      tr: 'Öğle namazı vakti geldi',
      en: 'It is time for Dhuhr prayer',
      ru: 'Пришло время намаза Зухр',
    },
  },
  {
    id: 'prayer_asr',
    timeKey: 'asr',
    titles: {
      tr: 'Namaz Vakti: İkindi',
      en: 'Prayer Time: Asr',
      ru: 'Время намаза: Аср',
    },
    bodies: {
      tr: 'İkindi namazı vakti geldi',
      en: 'It is time for Asr prayer',
      ru: 'Пришло время намаза Аср',
    },
  },
  {
    id: 'prayer_maghrib',
    timeKey: 'maghrib',
    titles: {
      tr: 'Namaz Vakti: Akşam',
      en: 'Prayer Time: Maghrib',
      ru: 'Время намаза: Магриб',
    },
    bodies: {
      tr: 'Akşam namazı vakti geldi',
      en: 'It is time for Maghrib prayer',
      ru: 'Пришло время намаза Магриб',
    },
  },
  {
    id: 'prayer_isha',
    timeKey: 'isha',
    titles: {
      tr: 'Namaz Vakti: Yatsı',
      en: 'Prayer Time: Isha',
      ru: 'Время намаза: Иша',
    },
    bodies: {
      tr: 'Yatsı namazı vakti geldi',
      en: 'It is time for Isha prayer',
      ru: 'Пришло время намаза Иша',
    },
  },
];

// ──────────────────────────────────────────
// Namaz Bildirimleri — Planlama & İptal
// ──────────────────────────────────────────

export async function schedulePrayerNotifications(
  times: PrayerTimesData,
  language: AppLanguage,
): Promise<void> {
  await cancelPrayerNotifications();
  await createChannels();

  const now = Date.now();

  for (const meta of PRAYER_META) {
    const timeStr = times[meta.timeKey];
    const date = parseTimeToTodayDate(timeStr);

    if (!date || date.getTime() <= now) {
      continue;
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    await notifee.createTriggerNotification(
      {
        id: meta.id,
        title: meta.titles[language],
        body: meta.bodies[language],
        android: {
          channelId: CHANNEL_PRAYER,
          smallIcon: 'ic_notification',
          pressAction: {id: 'default'},
        },
      },
      trigger,
    );
  }
}

export async function cancelPrayerNotifications(): Promise<void> {
  const ids = PRAYER_META.map(m => m.id);
  for (const id of ids) {
    try {
      await notifee.cancelNotification(id);
    } catch {
      // Bildirim yoksa sessizce geç
    }
  }
}

// ──────────────────────────────────────────
// Ramazan Bildirimleri
// ──────────────────────────────────────────

const IFTAR_META: Record<AppLanguage, {title: string; body: string}> = {
  tr: {title: 'İftar Vakti', body: 'İftar vakti geldi, hayırlı iftarlar!'},
  en: {title: 'Iftar Time', body: 'It is time to break your fast!'},
  ru: {title: 'Время ифтара', body: 'Пришло время разговения!'},
};

const SUHOOR_META: Record<AppLanguage, {title: string; body: string}> = {
  tr: {title: 'Sahur Hatırlatması', body: "Sahur için 30 dakikanız kaldı, acele edin!"},
  en: {title: 'Suhoor Reminder', body: '30 minutes left for Suhoor, hurry up!'},
  ru: {title: 'Напоминание о сухуре', body: 'До сухура осталось 30 минут!'},
};

export async function scheduleIftarReminder(
  maghribTime: string,
  language: AppLanguage,
): Promise<void> {
  await createChannels();

  const date = parseTimeToTodayDate(maghribTime);
  if (!date || date.getTime() <= Date.now()) {
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
  };

  const meta = IFTAR_META[language];

  await notifee.createTriggerNotification(
    {
      id: 'ramadan_iftar',
      title: meta.title,
      body: meta.body,
      android: {
        channelId: CHANNEL_REMINDERS,
        smallIcon: 'ic_notification',
        pressAction: {id: 'default'},
      },
    },
    trigger,
  );
}

export async function scheduleSuhoorReminder(
  fajrTime: string,
  language: AppLanguage,
): Promise<void> {
  await createChannels();

  const date = parseTimeToTodayDate(fajrTime);
  if (!date) {
    return;
  }

  // 30 dakika önce
  const reminderTime = date.getTime() - 30 * 60 * 1000;
  if (reminderTime <= Date.now()) {
    return;
  }

  const trigger: TimestampTrigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: reminderTime,
  };

  const meta = SUHOOR_META[language];

  await notifee.createTriggerNotification(
    {
      id: 'ramadan_suhoor',
      title: meta.title,
      body: meta.body,
      android: {
        channelId: CHANNEL_REMINDERS,
        smallIcon: 'ic_notification',
        pressAction: {id: 'default'},
      },
    },
    trigger,
  );
}

export async function cancelRamadanReminders(): Promise<void> {
  try {
    await notifee.cancelNotification('ramadan_iftar');
  } catch {
    // yok
  }
  try {
    await notifee.cancelNotification('ramadan_suhoor');
  } catch {
    // yok
  }
}
