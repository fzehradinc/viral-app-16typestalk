/**
 * HomeScreen — 13 section + alt spacer.
 * Üst yarı: Header, Allah İsimleri, Namaz Vakitleri, Günlük Ayet, Featured Carousel.
 * Alt yarı: SadaqahAd, DailyHadith, Affirmation, UsageStats, QuickActions,
 *           RamadanTracker, QiblaCompass, Community.
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  Share,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Alert} from 'react-native';
import {GradientBackground} from '../components';
import {
  HeaderSection,
  AllahNamesSection,
  PrayerTimesSection,
  DailyVerseSection,
  FeaturedCarousel,
  SadaqahAdSection,
  DailyHadithSection,
  AffirmationSection,
  UsageStatsSection,
  QuickActionsSection,
  RamadanTrackerCard,
  QiblaCompassSection,
  CommunitySection,
} from '../components/home';
import {usePrayerTimesStore} from '../store/prayerTimesStore';
import {useVerseStore} from '../store/verseStore';
import {useLanguageStore} from '../store/languageStore';
import {useSubscriptionStore} from '../store/subscriptionStore';
import {useAiStore} from '../store/aiStore';
import {useHadithStore} from '../store/hadithStore';
import {useDhikrStore} from '../store/dhikrStore';
import {useQiblaCompass} from '../hooks/useQiblaCompass';
import {useRewardedAd} from '../hooks/useRewardedAd';
import {spacing} from '../theme/spacing';
import type {AppLanguage, AppUser, MotivationalQuranic} from '../types';
import type {HomeStackParamList, MainTabParamList} from '../navigation/types';

/** Auth mock — TODO: Faz 5 gerçek authStore entegrasyonu */
const AUTH_MOCK: {isAuthenticated: boolean; currentUser: AppUser | null} = {
  isAuthenticated: false,
  currentUser: null,
};

function getVerseTranslation(
  verse: MotivationalQuranic,
  language: AppLanguage,
): string {
  switch (language) {
    case 'tr':
      return verse.translationTurkish;
    case 'ru':
      return verse.translationRussian;
    default:
      return verse.translation;
  }
}

/** Free kullanıcı günlük limiti */
const FREE_DAILY_LIMIT = 5;

function HomeScreen(): React.JSX.Element {
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList & MainTabParamList>>();

  // ── stores ──
  const {prayerTimes, locationName, locationStatus, coordinates, refresh} =
    usePrayerTimesStore();
  const {dailyVerse, isLoading: verseLoading, loadRandomVerse} =
    useVerseStore();
  const {currentLanguage} = useLanguageStore();
  const {isPro, canUseFeature, usageToday, remainingUses} =
    useSubscriptionStore();
  const {
    dailyAffirmation,
    savedDailyMood,
    isGenerating: affirmationLoading,
    generateAndSaveAffirmation,
    loadSavedAffirmation,
  } = useAiStore();
  const {
    dailyHadith,
    isLoading: hadithLoading,
    fetchHadith,
  } = useHadithStore();
  const {todayCount, increment: dhikrIncrement, reset: dhikrReset} =
    useDhikrStore();

  // ── qibla ──
  const {
    qiblaAngle,
    isCalibrating,
    startListening,
    stopListening,
  } = useQiblaCompass(
    coordinates?.latitude ?? 41.0082,
    coordinates?.longitude ?? 28.9784,
  );

  const [isInterpreting, _setIsInterpreting] = useState(false);
  const [_showInterpretationModal, _setShowInterpretationModal] =
    useState(false);

  // ── effects ──

  useEffect(() => {
    loadSavedAffirmation();
    startListening();
    return () => {
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchHadith(currentLanguage);
  }, [currentLanguage, fetchHadith]);

  // ── handlers ──

  const handleSignInPress = useCallback(() => {
    // TODO: Faz 5 — Auth ekranına yönlendirme
  }, []);

  const handleProfilePress = useCallback(() => {
    // TODO: Faz 5 — Profil ekranına yönlendirme
  }, []);

  const handleWisdomPress = useCallback(() => {
    // AI wisdom üretimi — Prompt 5
  }, []);

  const handleShareVerse = useCallback(() => {
    if (!dailyVerse) {
      return;
    }
    const translation = getVerseTranslation(dailyVerse, currentLanguage);
    const text =
      `"${dailyVerse.arabic}"\n\n` +
      `${translation}\n\n` +
      `— ${dailyVerse.surah} • Ayah ${dailyVerse.ayah}\n` +
      'Shared from Noorbloom';
    Share.share({message: text});
  }, [dailyVerse, currentLanguage]);

  const handleRefreshVerse = useCallback(() => {
    loadRandomVerse();
  }, [loadRandomVerse]);

  const handleRefreshPrayer = useCallback(() => {
    refresh();
  }, [refresh]);

  // ── alt yarı handlers ──

  const {showAd, isLoaded: adLoaded} = useRewardedAd();

  const handleWatchAd = useCallback(async () => {
    const earned = await showAd();
    if (earned) {
      Alert.alert(
        'JazakAllah Khair! 🤲',
        currentLanguage === 'tr'
          ? 'Desteğiniz için Allah razı olsun!'
          : 'May Allah reward you for your generosity!',
      );
    }
  }, [showAd, currentLanguage]);

  const handleRefreshHadith = useCallback(() => {
    fetchHadith(currentLanguage);
  }, [currentLanguage, fetchHadith]);

  const handleRefreshAffirmation = useCallback(() => {
    if (!canUseFeature()) {
      return;
    }
    generateAndSaveAffirmation(savedDailyMood || 'peaceful', currentLanguage);
  }, [
    canUseFeature,
    generateAndSaveAffirmation,
    savedDailyMood,
    currentLanguage,
  ]);

  const handleAddWidget = useCallback(() => {
    // TODO: Faz 5 — iOS Widget entegrasyonu
  }, []);

  const handleAffirmationsPress = useCallback(() => {
    navigation.navigate('Affirmations');
  }, [navigation]);

  const handleDuaPress = useCallback(() => {
    navigation.navigate('DuaTab' as never);
  }, [navigation]);

  const handleReflectPress = useCallback(() => {
    navigation.navigate('ReflectTab' as never);
  }, [navigation]);

  const handleQuranPress = useCallback(() => {
    navigation.navigate('QuranTab' as never);
  }, [navigation]);

  const handleRamadanPress = useCallback(() => {
    navigation.navigate('RamadanTracker', undefined);
  }, [navigation]);

  const handleCommunityPress = useCallback(() => {
    // TODO: Faz 5 — Topluluk ekranı
  }, []);

  // ── render ──

  return (
    <View style={styles.root}>
      <GradientBackground />
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}>
          {/* SECTION 1 — Header */}
          <HeaderSection
            userName={AUTH_MOCK.currentUser?.name ?? 'Noorbloom'}
            isPro={isPro}
            isAuthenticated={AUTH_MOCK.isAuthenticated}
            onSignInPress={handleSignInPress}
            onProfilePress={handleProfilePress}
          />

          {/* SECTION 2 — Allah'ın İsimleri */}
          <AllahNamesSection currentLanguage={currentLanguage} />

          {/* SECTION 3 — Namaz Vakitleri */}
          <PrayerTimesSection
            prayerTimes={prayerTimes}
            locationName={locationName}
            locationStatus={locationStatus}
            onRefresh={handleRefreshPrayer}
          />

          {/* SECTION 4 — Günlük Ayet */}
          <DailyVerseSection
            verse={dailyVerse}
            isLoading={verseLoading}
            currentLanguage={currentLanguage}
            onWisdomPress={handleWisdomPress}
            onSharePress={handleShareVerse}
            onRefreshPress={handleRefreshVerse}
            isInterpreting={isInterpreting}
          />

          {/* SECTION 5 — Featured Carousel */}
          <FeaturedCarousel currentLanguage={currentLanguage} />

          {/* SECTION 6 — Sadaqah Ad (free users only) */}
          {!isPro && (
            <SadaqahAdSection
              onWatchAd={handleWatchAd}
              currentLanguage={currentLanguage}
            />
          )}

          {/* SECTION 7 — Daily Hadith */}
          <DailyHadithSection
            hadith={dailyHadith}
            isLoading={hadithLoading}
            onRefresh={handleRefreshHadith}
          />

          {/* SECTION 8 — Affirmation */}
          <AffirmationSection
            affirmation={dailyAffirmation}
            mood={savedDailyMood}
            isLoading={affirmationLoading}
            onRefresh={handleRefreshAffirmation}
            onAddWidget={handleAddWidget}
          />

          {/* SECTION 9 — Usage Stats (free users only) */}
          {!isPro && (
            <UsageStatsSection
              usageToday={usageToday}
              remainingUses={remainingUses}
              dailyLimit={FREE_DAILY_LIMIT}
            />
          )}

          {/* SECTION 10 — Quick Actions */}
          <QuickActionsSection
            onAffirmationsPress={handleAffirmationsPress}
            onDuaPress={handleDuaPress}
            onReflectPress={handleReflectPress}
            onQuranPress={handleQuranPress}
          />

          {/* SECTION 11 — Ramadan Tracker */}
          <RamadanTrackerCard onPress={handleRamadanPress} />

          {/* SECTION 12 — Qibla Compass & Dhikr */}
          <QiblaCompassSection
            qiblaAngle={qiblaAngle}
            isCalibrating={isCalibrating}
            locationStatus={locationStatus}
            onStartListening={startListening}
            todayCount={todayCount}
            onDhikrIncrement={dhikrIncrement}
            onDhikrReset={dhikrReset}
          />

          {/* SECTION 13 — Community */}
          <CommunitySection onPress={handleCommunityPress} />

          {/* SECTION 14 — Bottom Spacer */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingBottom: spacing.xxl,
    gap: spacing.lg,
  },
  bottomSpacer: {
    height: 120,
  },
});

export default HomeScreen;
