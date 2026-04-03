/**
 * UsageStatsSection — günlük kullanım sayacı ve progress bar.
 * Sadece free kullanıcılar için görünür (HomeScreen kontrol eder).
 */

import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

interface UsageStatsSectionProps {
  usageToday: number;
  remainingUses: number;
  dailyLimit: number;
}

function UsageStatsSection({
  usageToday,
  remainingUses,
  dailyLimit,
}: UsageStatsSectionProps): React.JSX.Element {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const ratio = dailyLimit > 0 ? usageToday / dailyLimit : 0;
    Animated.timing(progressAnim, {
      toValue: Math.min(ratio, 1),
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [usageToday, dailyLimit, progressAnim]);

  const widthInterpolation = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Daily Usage</Text>
          <Text style={styles.remaining}>{remainingUses} remaining</Text>
        </View>

        <View style={styles.trackBar}>
          <Animated.View
            style={[styles.fillBar, {width: widthInterpolation}]}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: spacing.md,
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.white,
  },
  remaining: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.textSecondary,
  },
  trackBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 6,
    overflow: 'hidden',
  },
  fillBar: {
    height: 8,
    backgroundColor: palette.white,
    borderRadius: 6,
  },
});

export default UsageStatsSection;
