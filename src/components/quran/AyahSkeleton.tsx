/**
 * AyahSkeleton — okuyucuda ayet yüklenirken gösterilen placeholder.
 * Reanimated opacity pulse animasyonu.
 */

import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import {spacing} from '../../theme/spacing';

function AyahSkeleton(): React.JSX.Element {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, {duration: 800, easing: Easing.inOut(Easing.ease)}),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.badgeRow}>
        <Animated.View style={[styles.badge, animatedStyle]} />
      </View>
      <Animated.View style={[styles.arabicLine, animatedStyle]} />
      <Animated.View style={[styles.translationLine, animatedStyle]} />
      <Animated.View style={[styles.translationLineShort, animatedStyle]} />
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: spacing.sm,
  },
  badge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },
  arabicLine: {
    height: 28,
    width: '85%',
    alignSelf: 'flex-end',
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    marginBottom: spacing.sm,
  },
  translationLine: {
    height: 14,
    width: '90%',
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginBottom: 6,
  },
  translationLineShort: {
    height: 14,
    width: '60%',
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    marginTop: spacing.md,
  },
});

export default React.memo(AyahSkeleton);
