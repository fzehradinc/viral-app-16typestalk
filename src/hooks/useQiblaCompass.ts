/**
 * useQiblaCompass — magnetometre + qibla yönü hook'u.
 * react-native-sensors ile pusula verisi alır, qibla açısını hesaplar.
 */

import {useEffect, useRef, useState, useCallback} from 'react';
import {magnetometer, SensorTypes, setUpdateIntervalForType} from 'react-native-sensors';
import {Subscription} from 'rxjs';
import {calculateQiblaBearing} from '../services/qiblaService';

interface QiblaCompassState {
  /** Cihazın manyetik kuzeyden (0-360) açısı */
  heading: number;
  /** Qibla yönü — cihaza göre (0-360) */
  qiblaAngle: number;
  /** Hedef qibla yönü (sabit, lokasyona bağlı) */
  qiblaBearing: number;
  /** Pusula aktif mi */
  isListening: boolean;
  /** Kalibrasyon gerekiyor mu (çok düşük magnitude) */
  isCalibrating: boolean;
  startListening: () => void;
  stopListening: () => void;
}

function calculateHeading(x: number, y: number): number {
  let angle = Math.atan2(y, x) * (180 / Math.PI);
  // 0-360 aralığına normalize
  return (angle + 360) % 360;
}

export function useQiblaCompass(
  latitude: number,
  longitude: number,
): QiblaCompassState {
  const [heading, setHeading] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const subscriptionRef = useRef<Subscription | null>(null);

  const qiblaBearing = calculateQiblaBearing({latitude, longitude});

  const startListening = useCallback(() => {
    if (subscriptionRef.current) {
      return;
    }

    setUpdateIntervalForType(SensorTypes.magnetometer, 100);

    subscriptionRef.current = magnetometer.subscribe({
      next: ({x, y, z}) => {
        const magnitude = Math.sqrt(x * x + y * y + z * z);
        setIsCalibrating(magnitude < 25);

        const newHeading = calculateHeading(x, y);
        setHeading(newHeading);
      },
      error: () => {
        setIsCalibrating(true);
      },
    });

    setIsListening(true);
  }, []);

  const stopListening = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Unmount'ta otomatik temizle
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, []);

  // Qibla açısı: qiblaBearing - heading (0-360 normalize)
  const qiblaAngle = (qiblaBearing - heading + 360) % 360;

  return {
    heading,
    qiblaAngle,
    qiblaBearing,
    isListening,
    isCalibrating,
    startListening,
    stopListening,
  };
}
