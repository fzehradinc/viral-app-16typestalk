/**
 * Namaz vakitleri servisi — Aladhan API ile vakitleri çeker.
 * Swift PrayerTimesManager ile aynı endpoint ve metod (method=13 / Diyanet).
 */

import {format, parse, isAfter} from 'date-fns';
import type {Coordinates} from '../types';

export interface PrayerTimesData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

const DEFAULT_TIMES: PrayerTimesData = {
  fajr: '--:--',
  sunrise: '--:--',
  dhuhr: '--:--',
  asr: '--:--',
  maghrib: '--:--',
  isha: '--:--',
};

const ALADHAN_BASE = 'https://api.aladhan.com/v1/timings';

interface AladhanTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

interface AladhanResponse {
  data: {
    timings: AladhanTimings;
  };
}

/**
 * Aladhan API'den bugünün namaz vakitlerini çeker.
 * Method 13 → Diyanet İşleri Başkanlığı hesaplama metodu.
 */
export async function fetchPrayerTimes(
  coords: Coordinates,
): Promise<PrayerTimesData> {
  try {
    const dateStr = format(new Date(), 'dd-MM-yyyy');
    const url = `${ALADHAN_BASE}/${dateStr}?latitude=${coords.latitude}&longitude=${coords.longitude}&method=13`;
    const response = await fetch(url);
    const json: AladhanResponse = await response.json();
    const t = json.data.timings;

    return {
      fajr: stripTimezone(t.Fajr),
      sunrise: stripTimezone(t.Sunrise),
      dhuhr: stripTimezone(t.Dhuhr),
      asr: stripTimezone(t.Asr),
      maghrib: stripTimezone(t.Maghrib),
      isha: stripTimezone(t.Isha),
    };
  } catch {
    return DEFAULT_TIMES;
  }
}

/**
 * Aladhan bazen "05:30 (EET)" gibi timezone suffix ekler.
 * Sadece HH:mm kısmını korur.
 */
function stripTimezone(time: string): string {
  return time.replace(/\s*\(.*\)/, '').trim();
}

/** Vakit adları sıralı */
const PRAYER_ORDER: Array<{key: keyof PrayerTimesData; name: string}> = [
  {key: 'fajr', name: 'Fajr'},
  {key: 'sunrise', name: 'Sunrise'},
  {key: 'dhuhr', name: 'Dhuhr'},
  {key: 'asr', name: 'Asr'},
  {key: 'maghrib', name: 'Maghrib'},
  {key: 'isha', name: 'Isha'},
];

/**
 * Şu anki saatten sonraki ilk namaz vaktini bulur.
 * Tüm vakitler geçmişse null döner (ertesi gün).
 */
export function getNextPrayer(
  times: PrayerTimesData,
): {name: string; time: string} | null {
  const now = new Date();
  const todayStr = format(now, 'yyyy-MM-dd');

  for (const prayer of PRAYER_ORDER) {
    const timeStr = times[prayer.key];
    if (timeStr === '--:--') {
      continue;
    }
    const prayerDate = parse(
      `${todayStr} ${timeStr}`,
      'yyyy-MM-dd HH:mm',
      new Date(),
    );
    if (isAfter(prayerDate, now)) {
      return {name: prayer.name, time: timeStr};
    }
  }
  return null;
}
