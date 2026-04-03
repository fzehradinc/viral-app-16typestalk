/**
 * OnboardingScreen — 5 sayfalık animasyonlu tanıtım.
 * Tamamlandığında hasCompletedOnboarding flag'i set edilir,
 * AppNavigator otomatik MainTabNavigator'a geçer.
 */

import React, {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type {NativeScrollEvent, NativeSyntheticEvent, ViewToken} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
} from 'react-native-reanimated';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTranslation} from 'react-i18next';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const ONBOARDING_KEY = '@noorbloom/hasCompletedOnboarding';

interface OnboardingPage {
  key: string;
  titleKey: string;
  subtitleKey: string;
  emoji: string;
  gradient: readonly [string, string];
}

const PAGES: OnboardingPage[] = [
  {
    key: 'welcome',
    titleKey: 'onboarding.welcomeTitle',
    subtitleKey: 'onboarding.welcomeSubtitle',
    emoji: '🌸',
    gradient: ['#2D1B4E', '#1A0A2E'] as const,
  },
  {
    key: 'quran',
    titleKey: 'onboarding.quranTitle',
    subtitleKey: 'onboarding.quranSubtitle',
    emoji: '📖',
    gradient: ['#1A0A2E', '#0D0520'] as const,
  },
  {
    key: 'dhikr',
    titleKey: 'onboarding.dhikrTitle',
    subtitleKey: 'onboarding.dhikrSubtitle',
    emoji: '🤲',
    gradient: ['#2D1B4E', '#1A0A2E'] as const,
  },
  {
    key: 'diary',
    titleKey: 'onboarding.diaryTitle',
    subtitleKey: 'onboarding.diarySubtitle',
    emoji: '✨',
    gradient: ['#1A0A2E', '#0D0520'] as const,
  },
  {
    key: 'cta',
    titleKey: 'onboarding.ctaTitle',
    subtitleKey: 'onboarding.ctaSubtitle',
    emoji: '🌟',
    gradient: ['#2D1B4E', '#1A0A2E'] as const,
  },
];

function OnboardingScreen(): React.JSX.Element {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList<OnboardingPage>>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
  }, []);

  const handleNext = useCallback(() => {
    if (currentPage < PAGES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentPage + 1,
        animated: true,
      });
    } else {
      completeOnboarding();
    }
  }, [currentPage, completeOnboarding]);

  const handleSkip = useCallback(() => {
    completeOnboarding();
  }, [completeOnboarding]);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const page = Math.round(offsetX / SCREEN_WIDTH);
      if (page !== currentPage && page >= 0 && page < PAGES.length) {
        setCurrentPage(page);
      }
    },
    [currentPage],
  );

  const onViewableItemsChanged = useRef(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setCurrentPage(viewableItems[0].index);
      }
    },
  ).current;

  const viewabilityConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const isLastPage = currentPage === PAGES.length - 1;

  const renderPage = useCallback(
    ({item}: {item: OnboardingPage; index: number}) => (
      <LinearGradient
        colors={[...item.gradient]}
        style={styles.page}>
        <Animated.View
          entering={FadeIn.delay(200).duration(600)}
          style={styles.emojiContainer}>
          <Text style={styles.emoji}>{item.emoji}</Text>
        </Animated.View>
        <Animated.Text
          entering={FadeInUp.delay(400).duration(500)}
          style={styles.title}>
          {t(item.titleKey)}
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(600).duration(500)}
          style={styles.subtitle}>
          {t(item.subtitleKey)}
        </Animated.Text>
      </LinearGradient>
    ),
    [t],
  );

  const keyExtractor = useCallback((item: OnboardingPage) => item.key, []);

  return (
    <View style={styles.root}>
      <FlatList
        ref={flatListRef}
        data={PAGES}
        renderItem={renderPage}
        keyExtractor={keyExtractor}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        bounces={false}
        getItemLayout={(_, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
      />

      {/* Bottom navigation */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + spacing.md}]}>
        {/* Skip button */}
        {!isLastPage ? (
          <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
            <Text style={styles.skipText}>{t("onboarding.skip")}</Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.skipBtn} />
        )}

        {/* Dot indicators */}
        <View style={styles.dots}>
          {PAGES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentPage ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Next / Begin button */}
        <TouchableOpacity onPress={handleNext} style={styles.nextBtn}>
          <LinearGradient
            colors={[palette.pinkStart, palette.pinkEnd] as const}
            style={styles.nextGradient}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}>
            <Text style={styles.nextText}>
              {isLastPage
                ? t("onboarding.beginJourney")
                : t("onboarding.next")}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1A0A2E',
  },
  page: {
    width: SCREEN_WIDTH,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  emojiContainer: {
    marginBottom: spacing.xl,
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.white,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.lg,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  skipBtn: {
    width: 60,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  dot: {
    borderRadius: 50,
  },
  dotActive: {
    width: 10,
    height: 10,
    backgroundColor: palette.pinkStart,
  },
  dotInactive: {
    width: 6,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  nextBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  nextGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: 20,
  },
  nextText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.white,
  },
});

export default OnboardingScreen;
