/**
 * Noorbloom — Global TypeScript Tipleri
 *
 * Tüm modüller arasında paylaşılan temel veri yapıları burada tanımlanır.
 * Ekran / bileşen bazlı tipler ilgili klasörlerin kendi type dosyalarında tutulur.
 */

/** Desteklenen uygulama dilleri */
export type AppLanguage = 'tr' | 'en' | 'ru';

/** Temel kullanıcı profili */
export interface AppUser {
  id: string;
  email: string | null;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  provider: 'email' | 'google' | 'apple';
}

/** Abonelik planları */
export type SubscriptionPlan = 'free' | 'monthly' | 'yearly';

/** Namaz vakitleri (ISO 8601 time string) */
export interface PrayerTimes {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/** Esmaül Hüsna (99 İsim) */
export interface AllahName {
  arabic: string;
  transliteration: string;
  meaning: string;
  meaningTurkish: string;
  meaningRussian: string;
}

/** Koordinat çifti */
export interface Coordinates {
  latitude: number;
  longitude: number;
}

/** Tek bir ayet verisi (Quran API'den dönen yapı) */
export interface AyahData {
  number: number;
  text: string;
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    numberOfAyahs: number;
  };
}

/** 4 dilde çevirili ayet */
export interface AyahWithTranslations {
  arabic: AyahData;
  turkish: AyahData;
  english: AyahData;
  russian: AyahData;
}

/** Motivasyonel Kur'an ayeti (statik içerik dahil) */
export interface MotivationalQuranic {
  id: number;
  arabic: string;
  translation: string;
  translationTurkish: string;
  translationRussian: string;
  surah: string;
  ayah: string;
}

/** Sure özet bilgisi */
export interface SurahSummary {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: 'Meccan' | 'Medinan';
}

/** Ayet detay bilgisi (sure içinde) */
export interface AyahDetail {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

/** Sure detay bilgisi (ayetler dahil) */
export interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  ayahs: AyahDetail[];
}

/** Arapça + çeviri olarak sure verisi */
export interface SurahWithTranslation {
  arabic: SurahDetail;
  translation: SurahDetail;
}

/** Kaydedilmiş dua */
export interface SavedDua {
  id: string;
  recipientName: string;
  intention: string;
  dua: string;
  createdAt: string;
  language: AppLanguage;
}

/** Delail-i Hayrat bölüm verisi */
export interface DelailSection {
  id: string;
  title: string;
  titleTr: string;
  titleRu: string;
  content: string;
  translationEn: string;
  translationTr: string;
  translationRu: string;
}

/** Günlük tefekkür girdisi (SQLite'da saklanır) */
export interface ReflectionEntry {
  id: string;
  date: string;
  topic: string;
  content: string;
  aiReflection: string | null;
  mood: string | null;
  language: AppLanguage;
  createdAt: string;
}

/** Dhikr verisi */
export interface DhikrItem {
  id: string;
  arabic: string;
  transliteration: string;
  meaningEn: string;
  meaningTr: string;
  meaningRu: string;
  targetCount: number;
  category: 'tasbih' | 'tahmid' | 'takbir' | 'istighfar' | 'salawat' | 'other';
}

/** Hadis verisi */
export interface HadithData {
  hadeeth: string;
  attribution: string;
  language: string;
}

/** Ramazan oruç durumu */
export type FastingStatus = 'fasted' | 'missed' | 'excused' | 'pending';

/** Ramazan günü verisi */
export interface RamadanDay {
  dayNumber: number;
  date: string;
  fastingStatus: FastingStatus;
  tarawihCompleted: boolean;
  notes?: string;
}

/** Ramazan verisi (30 günlük) */
export interface RamadanData {
  year: number;
  days: RamadanDay[];
  iftarReminderEnabled: boolean;
  suhoorReminderEnabled: boolean;
  tarawihReminderEnabled: boolean;
}

/** Topluluk dua gönderisi */
export interface DuaPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  prayerCount: number;
  createdAt: string;
  language: AppLanguage;
}

/**
 * Tip dosyasını merkezi tutuyoruz çünkü:
 * 1. Tüm ekranlar ve servisler aynı veri şekillerini paylaşır.
 * 2. Tek bir "source of truth" güncellemeyi kolaylaştırır.
 * 3. Barrel export ile import yolları kısa kalır: import { AppUser } from '@/types'
 */
