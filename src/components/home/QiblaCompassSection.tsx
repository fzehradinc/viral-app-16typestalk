/**
 * QiblaCompassSection — kıble pusulası + zikir sayacı.
 * Reanimated ile smooth ibre rotasyonu, dhikr tap-to-count.
 */

import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

// ──────────────────────────────────────────
// Qibla Compass Card
// ──────────────────────────────────────────

interface QiblaCompassCardProps {
  qiblaAngle: number | null;
  isCalibrating: boolean;
  locationStatus: string;
  onStartListening: () => void;
}

function QiblaCompassCard({
  qiblaAngle,
  isCalibrating,
  locationStatus,
  onStartListening,
}: QiblaCompassCardProps): React.JSX.Element {
  const {t} = useTranslation();
  const rotation = useSharedValue(-35);

  useEffect(() => {
    const target = qiblaAngle != null ? qiblaAngle : -35;
    rotation.value = withTiming(target, {duration: 300});
  }, [qiblaAngle, rotation]);

  const needleStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value}deg`}],
  }));

  const statusText =
    locationStatus === 'denied'
      ? 'Enable Location'
      : isCalibrating
        ? 'Calibrating...'
        : '';

  return (
    <TouchableOpacity
      onPress={onStartListening}
      activeOpacity={0.85}
      style={styles.compassWrapper}>
      {/* Pusula dairesi */}
      <View style={styles.compassOuter}>
        <View style={styles.compassInner}>
          {/* Kuzey işareti */}
          <Text style={styles.northLabel}>N</Text>

          {/* İbre */}
          <Animated.View style={[styles.needleContainer, needleStyle]}>
            <LinearGradient
              colors={[palette.pinkStart, palette.white]}
              start={{x: 0.5, y: 0}}
              end={{x: 0.5, y: 1}}
              style={styles.needle}
            />
          </Animated.View>

          {/* Merkez nokta */}
          <View style={styles.centerDot} />
        </View>
      </View>

      <Text style={styles.compassTitle}>
        {t('common.settings').includes('Ayar') ? 'Kıble Pusulası' : 'Qibla Compass'}
      </Text>

      {statusText ? (
        <Text style={styles.statusText}>{statusText}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

// ──────────────────────────────────────────
// Dhikr Counter
// ──────────────────────────────────────────

interface DhikrCounterProps {
  todayCount: number;
  onIncrement: () => void;
  onReset: () => void;
}

function DhikrCounter({
  todayCount,
  onIncrement,
  onReset,
}: DhikrCounterProps): React.JSX.Element {
  return (
    <View style={styles.dhikrWrapper}>
      {/* Sıfırla butonu */}
      <TouchableOpacity
        onPress={onReset}
        style={styles.resetBtn}
        hitSlop={12}>
        <Icon name="refresh-outline" size={18} color={palette.textSecondary} />
      </TouchableOpacity>

      {/* Dekoratif dış daire */}
      <View style={styles.dhikrOuterRing}>
        <TouchableOpacity
          onPress={onIncrement}
          activeOpacity={0.85}
          style={styles.dhikrTouchable}>
          <LinearGradient
            colors={[palette.pinkStart, palette.pinkEnd]}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 1}}
            style={styles.dhikrCircle}>
            <Text style={styles.dhikrArabic}>اللهُ</Text>
            <Text style={styles.dhikrCount}>{todayCount}</Text>
            <Text style={styles.dhikrLabel}>SubhanAllah</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Salavat metni */}
      <Text style={styles.salavatText}>
        اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ
      </Text>
    </View>
  );
}

// ──────────────────────────────────────────
// QiblaCompassSection (ana bileşen)
// ──────────────────────────────────────────

interface QiblaCompassSectionProps {
  qiblaAngle: number | null;
  isCalibrating: boolean;
  locationStatus: string;
  onStartListening: () => void;
  todayCount: number;
  onDhikrIncrement: () => void;
  onDhikrReset: () => void;
}

function QiblaCompassSection({
  qiblaAngle,
  isCalibrating,
  locationStatus,
  onStartListening,
  todayCount,
  onDhikrIncrement,
  onDhikrReset,
}: QiblaCompassSectionProps): React.JSX.Element {
  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.row}>
        {/* Sol: Kıble Pusulası */}
        <View style={styles.column}>
          <QiblaCompassCard
            qiblaAngle={qiblaAngle}
            isCalibrating={isCalibrating}
            locationStatus={locationStatus}
            onStartListening={onStartListening}
          />
        </View>

        {/* Sağ: Dhikr Sayacı */}
        <View style={styles.column}>
          <DhikrCounter
            todayCount={todayCount}
            onIncrement={onDhikrIncrement}
            onReset={onDhikrReset}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingHorizontal: spacing.lg,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  column: {
    flex: 1,
    alignItems: 'center',
  },

  // ── Qibla Compass ──
  compassWrapper: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  compassOuter: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  compassInner: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.04)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  northLabel: {
    position: 'absolute',
    top: 8,
    fontSize: 12,
    fontWeight: '700',
    color: palette.pinkStart,
  },
  needleContainer: {
    width: 6,
    height: 70,
    alignItems: 'center',
  },
  needle: {
    width: 6,
    height: 70,
    borderRadius: 3,
  },
  centerDot: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.white,
  },
  compassTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.white,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '500',
    color: palette.textSecondary,
  },

  // ── Dhikr Counter ──
  dhikrWrapper: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  resetBtn: {
    alignSelf: 'flex-end',
    marginBottom: spacing.xs,
  },
  dhikrOuterRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: 'rgba(255,143,177,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhikrTouchable: {
    borderRadius: 80,
    overflow: 'hidden',
  },
  dhikrCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dhikrArabic: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.white,
    writingDirection: 'rtl',
  },
  dhikrCount: {
    fontSize: 40,
    fontWeight: '900',
    color: palette.white,
    marginTop: spacing.xs,
  },
  dhikrLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  salavatText: {
    fontSize: 14,
    color: palette.white,
    writingDirection: 'rtl',
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default QiblaCompassSection;
