/**
 * AllahNamesSection — otomatik dönen Esma-ül Hüsna kartı.
 * Her 5 saniyede bir sonraki isim, Reanimated fade animasyonu.
 */

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {useTranslation} from 'react-i18next';
import {ALLAH_NAMES, getMeaning} from '../../utils/allahNames';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {AppLanguage} from '../../types';

interface AllahNamesSectionProps {
  currentLanguage: AppLanguage;
}

function AllahNamesSection({
  currentLanguage,
}: AllahNamesSectionProps): React.JSX.Element {
  const {t} = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const goToNext = useCallback(() => {
    opacity.value = withTiming(0, {duration: 300}, () => {
      opacity.value = withTiming(1, {duration: 600});
    });
    // Index'i animasyonun ortasında güncelle
    setTimeout(() => {
      setCurrentIndex(prev => (prev + 1) % ALLAH_NAMES.length);
    }, 300);
  }, [opacity]);

  useEffect(() => {
    intervalRef.current = setInterval(goToNext, 5000);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [goToNext]);

  const name = ALLAH_NAMES[currentIndex];
  const meaning = getMeaning(name, currentLanguage);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {t('common.today').toUpperCase()} • DIVINE ATTRIBUTE
      </Text>

      <LinearGradient
        colors={[palette.pinkStart, palette.pinkEnd]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <Text style={styles.arabic}>{name.arabic}</Text>
          <Text style={styles.transliteration}>{name.transliteration}</Text>
          <Text style={styles.meaning}>{meaning}</Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.pinkStart,
    letterSpacing: 1.5,
    marginBottom: spacing.sm,
  },
  card: {
    borderRadius: 28,
    padding: spacing.lg,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  arabic: {
    fontSize: 48,
    fontWeight: '700',
    color: palette.white,
    textAlign: 'center',
  },
  transliteration: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.white,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  meaning: {
    fontSize: 15,
    fontWeight: '500',
    color: palette.white,
    opacity: 0.7,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
});

export default AllahNamesSection;
