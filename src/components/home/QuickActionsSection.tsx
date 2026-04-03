/**
 * QuickActionsSection — 2x2 grid hızlı erişim kartları.
 * Affirmations, Duas, Reflect, Qur'an navigasyonu.
 */

import React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
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

interface QuickActionsSectionProps {
  onAffirmationsPress: () => void;
  onDuaPress: () => void;
  onReflectPress: () => void;
  onQuranPress: () => void;
}

interface QuickActionCardProps {
  title: string;
  icon: string;
  gradientColors: readonly [string, string];
  onPress: () => void;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = (SCREEN_WIDTH - spacing.lg * 2 - spacing.md) / 2;

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function QuickActionCard({
  title,
  icon,
  gradientColors,
  onPress,
}: QuickActionCardProps): React.JSX.Element {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  function handlePressIn() {
    scale.value = withTiming(0.95, {duration: 100});
  }

  function handlePressOut() {
    scale.value = withTiming(1, {duration: 200});
  }

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
      style={[styles.cardWrapper, animatedStyle]}>
      <LinearGradient
        colors={[...gradientColors]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        <View style={styles.iconCircle}>
          <Icon name={icon} size={22} color={palette.white} />
        </View>
        <Text style={styles.cardTitle}>{title}</Text>
      </LinearGradient>
    </AnimatedTouchable>
  );
}

function QuickActionsSection({
  onAffirmationsPress,
  onDuaPress,
  onReflectPress,
  onQuranPress,
}: QuickActionsSectionProps): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <QuickActionCard
          title="Affirmations"
          icon="sparkles"
          gradientColors={[palette.purpleStart, palette.pinkEnd]}
          onPress={onAffirmationsPress}
        />
        <QuickActionCard
          title="Duas"
          icon="heart"
          gradientColors={['#E74C3C', palette.pinkEnd]}
          onPress={onDuaPress}
        />
      </View>
      <View style={styles.row}>
        <QuickActionCard
          title="Reflect"
          icon="moon"
          gradientColors={[palette.purpleStart, palette.purpleEnd]}
          onPress={onReflectPress}
        />
        <QuickActionCard
          title="Qur'an"
          icon="book"
          gradientColors={['#C0392B', '#E74C3C']}
          onPress={onQuranPress}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    height: 120,
    borderRadius: 28,
    overflow: 'hidden',
  },
  card: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
    borderRadius: 28,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.white,
  },
});

export default QuickActionsSection;
