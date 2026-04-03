import React, {useEffect, useState} from 'react';
import {StatusBar, Text, View, StyleSheet} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import GradientBackground from './src/components/common/GradientBackground';
import LoadingSpinner from './src/components/common/LoadingSpinner';
import * as adService from './src/services/adService';
import {initI18n} from './src/i18n';
import {useLanguageStore} from './src/store/languageStore';
import {useSubscriptionStore} from './src/store/subscriptionStore';
import {usePrayerTimesStore} from './src/store/prayerTimesStore';
import {useHadithStore} from './src/store/hadithStore';
import {useVerseStore} from './src/store/verseStore';
import {useDhikrStore} from './src/store/dhikrStore';
import {useStreakStore} from './src/store/streakStore';
import {useAiStore} from './src/store/aiStore';
import {useNotificationStore} from './src/store/notificationStore';
import {useQuranStore} from './src/store/quranStore';
import {useDuaStore} from './src/store/duaStore';
import {useReflectionStore} from './src/store/reflectionStore';
import {useRamadanStore} from './src/store/ramadanStore';
import {useAuthStore} from './src/store/authStore';
import {darkTheme} from './src/theme/colors';

const linking = {
  prefixes: [
    'noorbloom://',
    'typetalk16://',
    'https://noorbloom.app',
    'https://16typestalk.com',
  ],
  config: {
    screens: {
      Main: {
        path: 'main',
      },
      Login: {
        path: 'login',
      },
      Register: {
        path: 'register',
      },
      ForgotPassword: {
        path: 'forgot-password',
      },
    },
  },
};

function App(): React.JSX.Element {
  const [ready, setReady] = useState(false);
  const hydrateLanguage = useLanguageStore(s => s.hydrate);
  const hydrateSubscription = useSubscriptionStore(s => s.hydrate);
  const initSubscription = useSubscriptionStore(s => s.initialize);
  const currentLanguage = useLanguageStore(s => s.currentLanguage);

  const initPrayer = usePrayerTimesStore(s => s.initialize);
  const fetchHadith = useHadithStore(s => s.fetchHadith);
  const fetchVerse = useVerseStore(s => s.fetchDailyVerse);
  const hydrateDhikr = useDhikrStore(s => s.hydrate);
  const initStreak = useStreakStore(s => s.initialize);
  const loadAffirmation = useAiStore(s => s.loadSavedAffirmation);
  const initNotifications = useNotificationStore(s => s.initialize);
  const initQuran = useQuranStore(s => s.initialize);
  const initDua = useDuaStore(s => s.initialize);
  const initReflection = useReflectionStore(s => s.initialize);
  const initRamadan = useRamadanStore(s => s.initialize);
  const initAuth = useAuthStore(s => s.initialize);

  useEffect(() => {
    async function bootstrap() {
      // Phase 1 — critical: language, subscription cache, auth, RevenueCat
      await initI18n();
      await hydrateLanguage();
      await hydrateSubscription();
      await initAuth();
      // RevenueCat userId için Firebase UID gerekir — auth sonrasında çalışır
      const userId = useAuthStore.getState().currentUser?.id;
      await initSubscription(userId);

      // Phase 1b — sync: SQLite database initialization
      initReflection();

      // Phase 2 — data: initialize all other stores in parallel
      const lang = useLanguageStore.getState().currentLanguage;
      await Promise.all([
        adService.initialize(),
        initPrayer(),
        fetchHadith(lang),
        fetchVerse(lang),
        hydrateDhikr(),
        initStreak(),
        loadAffirmation(),
        initNotifications(),
        initQuran(),
        initDua(),
        initRamadan(),
      ]);

      setReady(true);
    }
    bootstrap();
  }, [
    hydrateLanguage,
    hydrateSubscription,
    initSubscription,
    initPrayer,
    fetchHadith,
    fetchVerse,
    hydrateDhikr,
    initStreak,
    loadAffirmation,
    initNotifications,
    initQuran,
    initDua,
    initRamadan,
    initAuth,
    initReflection,
  ]);

  if (!ready) {
    return (
      <View style={styles.loader}>
        <GradientBackground>
          <View style={styles.splashContent}>
            <Text style={styles.splashEmoji}>🌸</Text>
            <Text style={styles.splashTitle}>Noorbloom</Text>
            <LoadingSpinner />
          </View>
        </GradientBackground>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <NavigationContainer linking={linking}>
            <StatusBar
              barStyle={darkTheme.statusBar}
              backgroundColor={darkTheme.background}
            />
            <AppNavigator />
          </NavigationContainer>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loader: {
    flex: 1,
    backgroundColor: darkTheme.background,
  },
  splashContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashEmoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  splashTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FF8FB1',
    marginBottom: 24,
  },
});

export default App;

/**
 * Kök bileşen sıralaması:
 * GestureHandlerRootView → SafeAreaProvider → NavigationContainer
 * Bu sıralama react-navigation v7 dokümantasyonunun önerdiği en-dış-katman
 * düzenidir. Bootstrap sırası:
 *   Phase 1: i18n → languageStore → subscriptionStore
 *   Phase 2 (paralel): prayerTimes, hadith, verse, dhikr, streak, ai
 * Tüm store'lar hazır olana kadar loading spinner gösterilir.
 */
