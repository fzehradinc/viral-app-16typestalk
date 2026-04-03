/**
 * AffirmationSection — günlük olumlanma kartı.
 * Mood ikonu, pembe-mor gradient, dekoratif bloom efekti, yenile butonu.
 */

import React from 'react';
import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

interface AffirmationSectionProps {
  affirmation: string;
  mood: string;
  isLoading: boolean;
  onRefresh: () => void;
  onAddWidget: () => void;
}

const MOOD_ICONS: Record<string, string> = {
  Happy: '🌸',
  Sad: '🌧️',
  Anxious: '🌊',
  Confident: '👑',
  Heartbroken: '❤️‍🩹',
  Stressed: '🌬️',
  Lost: '🌫️',
  Grateful: '🤲',
  Depressed: '🌑',
  Motivated: '✨',
};

function getMoodEmoji(mood: string): string {
  return MOOD_ICONS[mood] ?? '🌸';
}

/** Dekoratif arka plan bloom daireleri + ışık süpürme */
function AffirmationBloom(): React.JSX.Element {
  const sweepX = useSharedValue(-150);

  React.useEffect(() => {
    sweepX.value = withRepeat(
      withTiming(400, {duration: 8000, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, [sweepX]);

  const sweepStyle = useAnimatedStyle(() => ({
    transform: [{translateX: sweepX.value}],
  }));

  return (
    <>
      <View style={styles.bloomCirclePink} />
      <View style={styles.bloomCircleBlue} />
      <Animated.View style={[styles.lightSweep, sweepStyle]} />
    </>
  );
}

function AffirmationSection({
  affirmation,
  mood,
  isLoading,
  onRefresh,
  onAddWidget,
}: AffirmationSectionProps): React.JSX.Element {
  const {t} = useTranslation();

  return (
    <View style={styles.wrapper}>
      {/* Başlık satırı */}
      <View style={styles.header}>
        <Text style={styles.label}>
          {t('common.affirmations').toUpperCase()}
        </Text>
        <TouchableOpacity onPress={onRefresh} hitSlop={12}>
          <Icon name="refresh-outline" size={20} color={palette.pinkStart} />
        </TouchableOpacity>
      </View>

      {/* Ana kart */}
      <LinearGradient
        colors={[palette.pinkEnd, palette.purpleStart]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        <AffirmationBloom />

        {/* Mood ikonu */}
        <Text style={styles.moodEmoji}>{getMoodEmoji(mood)}</Text>

        {/* Affirmation metni */}
        <Text style={styles.affirmationText}>
          {isLoading
            ? '...'
            : affirmation || 'Tap to receive your daily light'}
        </Text>

        {/* iOS widget banner */}
        {Platform.OS === 'ios' && (
          <TouchableOpacity onPress={onAddWidget} style={styles.widgetBanner}>
            <Icon name="apps-outline" size={14} color={palette.white} />
            <Text style={styles.widgetText}>Add home-screen widget</Text>
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.pinkStart,
    letterSpacing: 1.5,
  },
  card: {
    borderRadius: 28,
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 200,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bloomCirclePink: {
    position: 'absolute',
    top: -30,
    left: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,143,177,0.4)',
  },
  bloomCircleBlue: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(100,180,255,0.4)',
  },
  lightSweep: {
    position: 'absolute',
    top: 0,
    width: 60,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 30,
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: spacing.sm,
  },
  affirmationText: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: spacing.sm,
  },
  widgetBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
    gap: spacing.xs,
  },
  widgetText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.white,
  },
});

export default AffirmationSection;
