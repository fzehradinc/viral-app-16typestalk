/**
 * SkeletonRow — sure listesi yüklenirken gösterilen placeholder satır.
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

function SkeletonRow(): React.JSX.Element {
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
      <Animated.View style={[styles.circle, animatedStyle]} />
      <View style={styles.textBlock}>
        <Animated.View style={[styles.lineWide, animatedStyle]} />
        <Animated.View style={[styles.lineNarrow, animatedStyle]} />
      </View>
      <Animated.View style={[styles.arabicBlock, animatedStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginRight: spacing.sm,
  },
  textBlock: {
    flex: 1,
    marginRight: spacing.sm,
  },
  lineWide: {
    height: 14,
    width: '60%',
    borderRadius: 7,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginBottom: 6,
  },
  lineNarrow: {
    height: 10,
    width: '40%',
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  arabicBlock: {
    height: 18,
    width: 60,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
});

export default React.memo(SkeletonRow);
