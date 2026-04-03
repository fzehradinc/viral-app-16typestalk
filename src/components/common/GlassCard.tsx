import React from 'react';
import {
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {spacing} from '../../theme/spacing';

/**
 * GlassCard
 *
 * Swift'teki cam efektli (glassmorphism) kartların React Native karşılığı.
 * onPress sağlanırsa scale animasyonu ile etkileşimli hale gelir.
 */

interface GlassCardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function GlassCard({children, style, onPress}: GlassCardProps): React.JSX.Element {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  function handlePressIn() {
    scale.value = withTiming(0.97, {duration: 100});
  }

  function handlePressOut() {
    scale.value = withTiming(1, {duration: 200});
  }

  if (onPress) {
    return (
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[styles.card, animatedStyle, style]}>
        {children}
      </AnimatedTouchable>
    );
  }

  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderRadius: 24,
    overflow: 'hidden',
    padding: spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {elevation: 4},
    }),
  },
});

export default GlassCard;

/**
 * GlassCard tasarım kararları:
 * 1. Gerçek blur efekti (BlurView) yerine yarı saydam arka plan tercih edildi
 *    — cross-platform uyumluluk ve performans avantajı.
 * 2. Reanimated ile scale animasyonu dokunma geri bildirimi sağlar (0.97).
 * 3. onPress yoksa sade View render edilir — gereksiz event listener yok.
 */
