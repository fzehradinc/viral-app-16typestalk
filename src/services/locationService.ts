/**
 * Konum servisi — izin alma, koordinat döndürme ve ters geocoding.
 * iOS ve Android platform farkları burada soyutlanır.
 */

import {Platform, PermissionsAndroid} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import type {Coordinates} from '../types';

const ISTANBUL: Coordinates = {latitude: 41.0082, longitude: 28.9784};
const GEOCODE_BASE =
  'https://api.bigdatacloud.net/data/reverse-geocode-client';

/**
 * Platform'a uygun konum izni ister.
 * Başarılı ise true, reddedildi ise false döner.
 */
export async function requestLocationPermission(): Promise<boolean> {
  try {
    if (Platform.OS === 'ios') {
      const status = await Geolocation.requestAuthorization('whenInUse');
      return status === 'granted';
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Noorbloom Location Permission',
        message:
          'Noorbloom needs your location to calculate prayer times and Qibla direction.',
        buttonPositive: 'OK',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

/**
 * Mevcut cihaz konumunu döndürür.
 * Hata durumunda İstanbul koordinatlarını fallback olarak kullanır.
 */
export function getCurrentPosition(): Promise<Coordinates> {
  return new Promise(resolve => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      () => {
        resolve(ISTANBUL);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      },
    );
  });
}

/**
 * Koordinatlardan şehir adını döndürür.
 * BigDataCloud ters geocoding API'si kullanılır.
 */
export async function getCityName(coords: Coordinates): Promise<string> {
  try {
    const url = `${GEOCODE_BASE}?latitude=${coords.latitude}&longitude=${coords.longitude}&localityLanguage=en`;
    const response = await fetch(url);
    const data: Record<string, string> = await response.json();
    return (
      data.city ||
      data.locality ||
      data.principalSubdivision ||
      data.countryName ||
      'Current Location'
    );
  } catch {
    return 'Current Location';
  }
}
