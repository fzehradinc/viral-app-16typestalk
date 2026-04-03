/**
 * Namaz vakitleri store — konum izni, koordinat, şehir adı ve vakitler.
 * Uygulama açılışında initialize() çağrılır.
 */

import {create} from 'zustand';
import {
  requestLocationPermission,
  getCurrentPosition,
  getCityName,
} from '../services/locationService';
import {fetchPrayerTimes, type PrayerTimesData} from '../services/prayerTimesService';
import type {Coordinates} from '../types';

type LocationStatus = 'idle' | 'loading' | 'granted' | 'denied';

const DEFAULT_TIMES: PrayerTimesData = {
  fajr: '--:--',
  sunrise: '--:--',
  dhuhr: '--:--',
  asr: '--:--',
  maghrib: '--:--',
  isha: '--:--',
};

interface PrayerTimesState {
  prayerTimes: PrayerTimesData;
  locationName: string;
  coordinates: Coordinates | null;
  locationStatus: LocationStatus;
  isLoading: boolean;
  initialize: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const usePrayerTimesStore = create<PrayerTimesState>((set, get) => ({
  prayerTimes: DEFAULT_TIMES,
  locationName: '',
  coordinates: null,
  locationStatus: 'idle',
  isLoading: false,

  initialize: async () => {
    set({isLoading: true, locationStatus: 'loading'});

    try {
      const granted = await requestLocationPermission();

      if (!granted) {
        set({locationStatus: 'denied', isLoading: false});
        return;
      }

      set({locationStatus: 'granted'});

      const coords = await getCurrentPosition();
      const [cityName, times] = await Promise.all([
        getCityName(coords),
        fetchPrayerTimes(coords),
      ]);

      set({
        coordinates: coords,
        locationName: cityName,
        prayerTimes: times,
        isLoading: false,
      });
    } catch {
      set({isLoading: false});
    }
  },

  refresh: async () => {
    await get().initialize();
  },
}));
