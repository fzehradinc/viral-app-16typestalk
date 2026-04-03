import type {NavigatorScreenParams} from '@react-navigation/native';

/**
 * Noorbloom — Route Parameter Tipleri
 *
 * Tüm navigator'ların parametre haritaları burada tanımlanır.
 * react-navigation v7 ile tip güvenli navigasyon sağlar.
 */

/** Home sekmesi stack'i */
export type HomeStackParamList = {
  HomeMain: undefined;
  Affirmations: undefined;
  DhikrList: undefined;
  DhikrMatic: {
    initialCount?: number;
    dhikrItem?: import('../types').DhikrItem;
  };
  RamadanTracker: undefined;
};

/** Quran sekmesi stack'i */
export type QuranStackParamList = {
  QuranMain: undefined;
  QuranHome: undefined;
  QuranReader: {
    surahNumber: number;
    surahName: string;
    surahArabicName: string;
    numberOfAyahs: number;
    initialAyah?: number;
  };
};

/** Dua sekmesi stack'i */
export type DuaStackParamList = {
  DuaMain: undefined;
  DuaShare: {
    dua: string;
    recipientName: string;
    language: import('../types').AppLanguage;
  };
  DelailHayrat: undefined;
  DuaCommunity: undefined;
};

/** Reflect sekmesi stack'i */
export type ReflectStackParamList = {
  ReflectMain: undefined;
  ReflectCalendar: undefined;
  ReflectDetail: {
    entryId: string;
    date: string;
  };
};

/** Profile sekmesi stack'i */
export type ProfileStackParamList = {
  ProfileMain: undefined;
  LanguageSelect: undefined;
  NotificationSettings: undefined;
  SubscriptionScreen: undefined;
  AboutScreen: undefined;
};

/** Ana 5 sekmeli tab bar */
export type MainTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  QuranTab: NavigatorScreenParams<QuranStackParamList>;
  DuaTab: NavigatorScreenParams<DuaStackParamList>;
  ReflectTab: NavigatorScreenParams<ReflectStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};

/** Kök navigator: onboarding veya ana uygulama */
export type RootStackParamList = {
  Onboarding: undefined;
  Main: NavigatorScreenParams<MainTabParamList>;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

/**
 * Tüm parametre haritaları tek dosyada toplandı çünkü:
 * 1. navigate() çağrılarında tip kontrolü doğrudan çalışır.
 * 2. NavigatorScreenParams ile iç içe navigator tipleri desteklenir.
 * 3. İlerleyen promptlarda yeni ekranlar eklemek tek noktada yapılır.
 */
