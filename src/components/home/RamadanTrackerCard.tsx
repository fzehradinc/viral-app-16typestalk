/**
 * RamadanTrackerCard — Ramazan takibi navigasyon kartı.
 * Mor gradient, emoji dekorasyon, chevron ikonu.
 */

import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

interface RamadanTrackerCardProps {
  onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function RamadanTrackerCard({
  onPress,
}: RamadanTrackerCardProps): React.JSX.Element {
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

  return (
    <View style={styles.wrapper}>
      <AnimatedTouchable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
        style={[styles.touchable, animatedStyle]}>
        <LinearGradient
          colors={['#4C267A', '#7A3F99']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.card}>
          {/* Sol: emoji */}
          <View style={styles.emojiCircle}>
            <Text style={styles.emoji}>🌙</Text>
          </View>

          {/* Orta: metin */}
          <View style={styles.textWrapper}>
            <Text style={styles.title}>Ramadan Tracker</Text>
            <Text style={styles.subtitle}>
              Track your fasts &amp; Tarawih
            </Text>
          </View>

          {/* Sağ: chevron */}
          <Icon
            name="chevron-forward-circle"
            size={28}
            color="rgba(255,255,255,0.6)"
          />
        </LinearGradient>
      </AnimatedTouchable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
  },
  touchable: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  card: {
    height: 110,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  emojiCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  emoji: {
    fontSize: 28,
  },
  textWrapper: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.white,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
});

export default RamadanTrackerCard;
