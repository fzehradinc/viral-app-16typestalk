/**
 * DhikrMaticScreen — tam ekran tesbih sayacı.
 * SVG progress arc + Reanimated tamamlanma animasyonu.
 */

import React, {useCallback, useState} from 'react';
import {
  Modal,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Vibration,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {NativeStackNavigationProp, NativeStackScreenProps} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import Svg, {Circle, Path} from 'react-native-svg';
import {GradientBackground, PrimaryButton} from '../components';
import {useDhikrStore} from '../store/dhikrStore';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import type {HomeStackParamList} from '../navigation/types';

type Props = NativeStackScreenProps<HomeStackParamList, 'DhikrMatic'>;
type Nav = NativeStackNavigationProp<HomeStackParamList>;

const CIRCLE_SIZE = 220;
const INNER_CIRCLE = 190;
const ARC_RADIUS = 108;
const SVG_SIZE = 220;
const CENTER = SVG_SIZE / 2;

function buildArcPath(progress: number): string {
  if (progress <= 0) {
    return '';
  }
  const clampedProgress = Math.min(progress, 0.9999);
  const angle = clampedProgress * 360;
  const radians = (angle * Math.PI) / 180;
  const x = CENTER + ARC_RADIUS * Math.sin(radians);
  const y = CENTER - ARC_RADIUS * Math.cos(radians);
  const largeArc = angle > 180 ? 1 : 0;
  return `M ${CENTER} ${CENTER - ARC_RADIUS} A ${ARC_RADIUS} ${ARC_RADIUS} 0 ${largeArc} 1 ${x} ${y}`;
}

function DhikrMaticScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Props['route']>();
  const {initialCount, dhikrItem} = route.params ?? {};

  const {todayCount, increment, reset} = useDhikrStore();

  const [sessionCount, setSessionCount] = useState(initialCount ?? 0);
  const [targetCount] = useState(dhikrItem?.targetCount ?? 33);
  const [showCompleted, setShowCompleted] = useState(false);

  // Pulse animation for completion glow
  const glowOpacity = useSharedValue(1);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  const handlePress = useCallback(() => {
    const newCount = sessionCount + 1;
    setSessionCount(newCount);
    increment();

    if (newCount >= targetCount) {
      setShowCompleted(true);
      try {
        Vibration.vibrate([0, 50, 100, 50]);
      } catch {
        // silent
      }
      glowOpacity.value = withRepeat(
        withSequence(
          withTiming(0.4, {duration: 600}),
          withTiming(1, {duration: 600}),
        ),
        3,
        true,
      );
    }
  }, [sessionCount, targetCount, increment, glowOpacity]);

  const handleReset = useCallback(() => {
    setSessionCount(0);
  }, []);

  const handleContinue = useCallback(() => {
    setShowCompleted(false);
    setSessionCount(0);
  }, []);

  const progress = targetCount > 0 ? sessionCount / targetCount : 0;
  const arcPath = buildArcPath(progress);

  const arabicDisplay = dhikrItem?.arabic ?? 'اللَّهُ';
  const transliterationDisplay = dhikrItem?.transliteration ?? 'SubhanAllah';

  return (
    <GradientBackground>
      <StatusBar hidden />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={palette.white} />
          </TouchableOpacity>
          <Text style={styles.topTitle} numberOfLines={1}>
            {arabicDisplay}
          </Text>
          <TouchableOpacity style={styles.topButton} onPress={handleReset}>
            <Ionicons name="refresh" size={22} color={palette.white} />
          </TouchableOpacity>
        </View>

        {/* Main counter area */}
        <View style={styles.counterContainer}>
          {/* SVG Progress Arc */}
          <View style={styles.svgContainer}>
            <Svg width={SVG_SIZE} height={SVG_SIZE} style={styles.svgAbsolute}>
              {/* Outer decorative circle */}
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={ARC_RADIUS}
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={3}
                fill="none"
              />
              {/* Progress arc */}
              {progress > 0 && (
                <Path
                  d={arcPath}
                  stroke={palette.pinkStart}
                  strokeWidth={4}
                  strokeLinecap="round"
                  fill="none"
                />
              )}
            </Svg>

            {/* Tappable counter circle */}
            <Animated.View style={progress >= 1 ? glowStyle : undefined}>
              <TouchableOpacity
                style={styles.counterCircle}
                onPress={handlePress}
                activeOpacity={0.8}>
                <Text style={styles.counterArabic}>{arabicDisplay}</Text>
                <Text style={styles.counterNumber}>{sessionCount}</Text>
                <Text style={styles.counterTransliteration}>
                  {transliterationDisplay}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Target indicator */}
          <Text style={styles.targetText}>
            {sessionCount} / {targetCount}
          </Text>
        </View>

        {/* Bottom info */}
        <View style={styles.bottomInfo}>
          <Text style={styles.todayText}>Today: {todayCount} total</Text>
          <Text style={styles.salavatText}>
            اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَىٰ نَبِيِّنَا مُحَمَّدٍ
          </Text>
          <View style={styles.dotsRow}>
            <View style={styles.dot} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>
      </SafeAreaView>

      {/* Completion Modal */}
      <Modal
        visible={showCompleted}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCompleted(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalEmoji}>🌟</Text>
            <Text style={styles.modalTitle}>MaşaAllah!</Text>
            <Text style={styles.modalMessage}>
              You completed {targetCount} dhikr. May Allah accept it.
            </Text>
            <PrimaryButton title="Continue" onPress={handleContinue} />
            <PrimaryButton
              title="Done"
              onPress={() => navigation.goBack()}
              variant="ghost"
            />
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  topButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    ...typography.heading,
    color: palette.white,
    flex: 1,
    textAlign: 'center',
  },
  counterContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    width: SVG_SIZE,
    height: SVG_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgAbsolute: {
    position: 'absolute',
  },
  counterCircle: {
    width: INNER_CIRCLE,
    height: INNER_CIRCLE,
    borderRadius: INNER_CIRCLE / 2,
    backgroundColor: palette.pinkStart,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: palette.pinkStart,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  counterArabic: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.white,
    marginBottom: spacing.xs,
  },
  counterNumber: {
    fontSize: 40,
    fontWeight: '900',
    color: palette.white,
  },
  counterTransliteration: {
    ...typography.small,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '600',
    marginTop: spacing.xs,
  },
  targetText: {
    ...typography.caption,
    color: palette.textSecondary,
    marginTop: spacing.md,
  },
  bottomInfo: {
    alignItems: 'center',
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  todayText: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  salavatText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: palette.backgroundDark,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  modalEmoji: {
    fontSize: 60,
  },
  modalTitle: {
    ...typography.title,
    color: palette.white,
  },
  modalMessage: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
  },
});

export default DhikrMaticScreen;
