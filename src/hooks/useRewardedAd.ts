/**
 * useRewardedAd — rewarded reklam hook'u.
 * Reklam yükle, göster, ödül kazanma durumunu izle.
 */

import {useCallback, useEffect, useRef, useState} from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
} from 'react-native-google-mobile-ads';
import * as adService from '../services/adService';

interface UseRewardedAdReturn {
  isLoaded: boolean;
  isLoading: boolean;
  showAd: () => Promise<boolean>;
  loadAd: () => void;
}

export function useRewardedAd(): UseRewardedAdReturn {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const rewardedRef = useRef<RewardedAd | null>(null);
  const earnedRef = useRef(false);
  const resolveRef = useRef<((earned: boolean) => void) | null>(null);

  const loadAd = useCallback(() => {
    setIsLoaded(false);
    setIsLoading(true);
    earnedRef.current = false;

    const adUnitId = adService.getRewardedAdUnitId();
    const rewarded = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: true,
    });

    const unsubLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        setIsLoaded(true);
        setIsLoading(false);
      },
    );

    const unsubEarned = rewarded.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      () => {
        earnedRef.current = true;
        if (resolveRef.current) {
          resolveRef.current(true);
          resolveRef.current = null;
        }
      },
    );

    rewarded.load();
    rewardedRef.current = rewarded;

    return () => {
      unsubLoaded();
      unsubEarned();
    };
  }, []);

  const showAd = useCallback(async (): Promise<boolean> => {
    if (!isLoaded || !rewardedRef.current) {
      return false;
    }

    earnedRef.current = false;

    return new Promise<boolean>(resolve => {
      resolveRef.current = resolve;
      rewardedRef.current!.show();

      // Timeout — 30 saniye sonra resolve et
      setTimeout(() => {
        if (resolveRef.current) {
          resolveRef.current(earnedRef.current);
          resolveRef.current = null;
        }
      }, 30000);
    }).finally(() => {
      // Sonraki reklam için yeniden yükle
      loadAd();
    });
  }, [isLoaded, loadAd]);

  useEffect(() => {
    const cleanup = loadAd();
    return cleanup;
  }, [loadAd]);

  return {isLoaded, isLoading, showAd, loadAd};
}
