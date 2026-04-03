/**
 * Ortam değişkenleri — react-native-config ile .env'den okunur.
 * .env dosyasını köke koy (örn. .env.development), Metro yeniden başlatıldığında değerler güncellenir.
 */
import Config from 'react-native-config';

export const ENV = {
  SUPABASE_URL: Config.SUPABASE_URL,
  SUPABASE_ANON_KEY: Config.SUPABASE_ANON_KEY,
  GOOGLE_WEB_CLIENT_ID: Config.GOOGLE_WEB_CLIENT_ID,
  REVENUECAT_IOS_KEY: Config.REVENUECAT_IOS_KEY,
  REVENUECAT_ANDROID_KEY: Config.REVENUECAT_ANDROID_KEY,
  ADMOB_IOS_APP_ID: Config.ADMOB_IOS_APP_ID,
  ADMOB_ANDROID_APP_ID: Config.ADMOB_ANDROID_APP_ID,
  ADMOB_BANNER_IOS: Config.ADMOB_BANNER_IOS,
  ADMOB_BANNER_ANDROID: Config.ADMOB_BANNER_ANDROID,
  ADMOB_REWARDED_IOS: Config.ADMOB_REWARDED_IOS,
  ADMOB_REWARDED_ANDROID: Config.ADMOB_REWARDED_ANDROID,
} as const;
