/**
 * adService — Google AdMob SDK sarmalayıcı.
 * Banner ve rewarded reklam ID yönetimi, SDK başlatma.
 */

import {Platform} from 'react-native';
import {MobileAds, TestIds} from 'react-native-google-mobile-ads';
import {ENV} from '../config/env';

/** AdMob SDK'yı başlat */
export async function initialize(): Promise<void> {
  try {
    await MobileAds().initialize();
    if (__DEV__) {
      console.log('[adService] MobileAds initialized');
    }
  } catch {
    if (__DEV__) {
      console.log('[adService] MobileAds init failed');
    }
  }
}

/** Banner reklam unit ID — __DEV__ modda test ID kullanır */
export function getBannerAdUnitId(): string {
  if (__DEV__) {
    return TestIds.BANNER;
  }
  return Platform.select({
    ios: ENV.ADMOB_BANNER_IOS,
    default: ENV.ADMOB_BANNER_ANDROID,
  });
}

/** Rewarded reklam unit ID — __DEV__ modda test ID kullanır */
export function getRewardedAdUnitId(): string {
  if (__DEV__) {
    return TestIds.REWARDED;
  }
  return Platform.select({
    ios: ENV.ADMOB_REWARDED_IOS,
    default: ENV.ADMOB_REWARDED_ANDROID,
  });
}

/** iOS 14+ ATT izin isteme — paket yoksa sessizce geç */
export async function requestTracking(): Promise<void> {
  if (Platform.OS !== 'ios') {
    return;
  }
  try {
    const {requestTrackingPermission} = await import(
      // @ts-expect-error — optional dependency, may not be installed
      'react-native-tracking-transparency'
    );
    await requestTrackingPermission();
  } catch {
    // Paket kurulu değil veya izin zaten işlendi — sessizce geç
  }
}
