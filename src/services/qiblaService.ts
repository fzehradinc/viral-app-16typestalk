/**
 * Kıble yönü servisi — Haversine formülü ile Kabe bearing hesaplama.
 * Swift QiblaCompassManager'daki aynı trigonometrik hesaplama.
 */

import type {Coordinates} from '../types';

const KAABA_LATITUDE = 21.4225;
const KAABA_LONGITUDE = 39.8262;

function toRadians(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDegrees(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Kullanıcının konumundan Kabe'ye bearing açısını hesaplar (derece).
 * Haversine yön formülü kullanılır; sonuç 0-360 arası normalize edilir.
 */
export function calculateQiblaBearing(coords: Coordinates): number {
  const lat1 = toRadians(coords.latitude);
  const lon1 = toRadians(coords.longitude);
  const lat2 = toRadians(KAABA_LATITUDE);
  const lon2 = toRadians(KAABA_LONGITUDE);

  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

  let bearing = toDegrees(Math.atan2(y, x));
  bearing = ((bearing % 360) + 360) % 360;

  return bearing;
}
