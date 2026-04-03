/**
 * ProfileScreen — iskelet + çalışan bölümler.
 * Firebase Auth ve RevenueCat entegre.
 */

import React, {useCallback} from 'react';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {GradientBackground, GlassCard} from '../components';
import {useLanguageStore} from '../store/languageStore';
import {useNotificationStore} from '../store/notificationStore';
import {useSubscriptionStore} from '../store/subscriptionStore';
import {useStreakStore} from '../store/streakStore';
import {useAuthStore} from '../store/authStore';
import type {RootStackParamList} from '../navigation/types';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import type {AppLanguage} from '../types';
import type {ProfileStackParamList} from '../navigation/types';

const LANGUAGES: {code: AppLanguage; label: string; flag: string}[] = [
  {code: 'en', label: 'EN', flag: '🇺🇸'},
  {code: 'tr', label: 'TR', flag: '🇹🇷'},
  {code: 'ru', label: 'RU', flag: '🇷🇺'},
];

const FREE_DAILY_LIMIT = 5;

function ProfileScreen(): React.JSX.Element {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();

  const {currentLanguage, setLanguage} = useLanguageStore();
  const {
    prayerRemindersEnabled,
    isPermissionGranted,
  } = useNotificationStore();
  const {currentPlan, isPro, usageToday, remainingUses, restorePurchases} =
    useSubscriptionStore();
  const {currentStreak, longestStreak, totalReflections, totalDuas} =
    useStreakStore();
  const {currentUser, isAuthenticated, signOut, deleteAccount} =
    useAuthStore();

  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleSignIn = useCallback(() => {
    rootNavigation.navigate('Login');
  }, [rootNavigation]);

  const handleSignOut = useCallback(() => {
    Alert.alert(t("auth.signOut"), t("auth.signOutConfirm"), [
      {text: t("common.cancel"), style: 'cancel'},
      {
        text: t("auth.signOut"),
        style: 'destructive',
        onPress: () => signOut(),
      },
    ]);
  }, [signOut, t]);

  const handleDeleteAccount = useCallback(() => {
    Alert.alert(t("auth.deleteAccount"), t("auth.deleteAccountConfirm"), [
      {text: t("common.cancel"), style: 'cancel'},
      {
        text: t("common.delete"),
        style: 'destructive',
        onPress: () => deleteAccount(),
      },
    ]);
  }, [deleteAccount, t]);

  const handleLanguageChange = useCallback(
    (lang: AppLanguage) => {
      setLanguage(lang);
    },
    [setLanguage],
  );

  const handleOpenSettings = useCallback(() => {
    Linking.openSettings();
  }, []);

  const planLabel =
    currentPlan === 'free'
      ? t("subscription.free")
      : currentPlan === 'monthly'
        ? t("subscription.monthly")
        : t("subscription.yearly");

  const usagePercent = isPro ? 100 : ((FREE_DAILY_LIMIT - remainingUses) / FREE_DAILY_LIMIT) * 100;

  return (
    <GradientBackground>
      <ScrollView
        style={styles.root}
        contentContainerStyle={[
          styles.content,
          {paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xxl},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Auth section */}
        <GlassCard style={styles.authCard}>
          {isAuthenticated && currentUser ? (
            <>
              <LinearGradient
                colors={[palette.purpleStart, palette.purpleEnd] as const}
                style={styles.avatar}>
                <Text style={styles.avatarInitial}>
                  {currentUser.name.charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
              <Text style={styles.userName}>{currentUser.name}</Text>
              {currentUser.email && (
                <Text style={styles.userEmail}>{currentUser.email}</Text>
              )}
            </>
          ) : (
            <>
              <LinearGradient
                colors={[palette.pinkStart, palette.pinkEnd] as const}
                style={styles.avatar}>
                <Icon name="person" size={28} color={palette.white} />
              </LinearGradient>
              <Text style={styles.authText}>{t("auth.signInPrompt")}</Text>
              <TouchableOpacity
                style={styles.signInBtn}
                onPress={handleSignIn}>
                <LinearGradient
                  colors={[palette.pinkStart, palette.pinkEnd] as const}
                  style={styles.signInGradient}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Text style={styles.signInText}>
                    {t("auth.signIn")} / {t("auth.signUp")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}
        </GlassCard>

        {/* Journey stats */}
        <Text style={styles.sectionTitle}>Your Journey</Text>
        <View style={styles.statsGrid}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statEmoji}>🔥</Text>
            <Text style={styles.statNumber}>{currentStreak}</Text>
            <Text style={styles.statLabel}>{t("profile.streak")}</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statEmoji}>📖</Text>
            <Text style={styles.statNumber}>{totalReflections}</Text>
            <Text style={styles.statLabel}>{t("profile.totalReflections")}</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statEmoji}>🤲</Text>
            <Text style={styles.statNumber}>{totalDuas}</Text>
            <Text style={styles.statLabel}>{t("profile.totalDuas")}</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statEmoji}>⭐</Text>
            <Text style={styles.statNumber}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Best Streak</Text>
          </GlassCard>
        </View>

        {/* Plan */}
        <GlassCard style={styles.planCard}>
          <View style={styles.planRow}>
            <View>
              <Text style={styles.planTitle}>Plan</Text>
              <Text style={styles.planName}>{planLabel}</Text>
            </View>
            {isPro ? (
              <View style={styles.activeBadge}>
                <Icon name="checkmark-circle" size={16} color="#1D9E75" />
                <Text style={styles.activeText}>Active</Text>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate("SubscriptionScreen", undefined)}>
                <LinearGradient
                  colors={[palette.pinkStart, palette.pinkEnd] as const}
                  style={styles.upgradeBtn}
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Text style={styles.upgradeBtnText}>
                    {t("subscription.upgrade")}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
          {!isPro && (
            <View style={styles.usageContainer}>
              <View style={styles.usageBarBg}>
                <View
                  style={[styles.usageBarFill, {width: `${usagePercent}%`}]}
                />
              </View>
              <Text style={styles.usageText}>
                {remainingUses} / {FREE_DAILY_LIMIT} remaining
              </Text>
              <TouchableOpacity
                style={styles.restoreBtn}
                onPress={() => restorePurchases()}>
                <Text style={styles.restoreText}>
                  {t("subscription.restore")}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>

        {/* Language */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.cardTitle}>{t("common.language")}</Text>
          <View style={styles.langRow}>
            {LANGUAGES.map(lang => (
              <TouchableOpacity
                key={lang.code}
                onPress={() => handleLanguageChange(lang.code)}
                style={[
                  styles.langBtn,
                  currentLanguage === lang.code && styles.langBtnActive,
                ]}>
                <Text style={styles.langFlag}>{lang.flag}</Text>
                <Text style={styles.langLabel}>{lang.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassCard>

        {/* Notifications */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.cardTitle}>{t("common.notifications")}</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Prayer Reminders</Text>
            <Switch
              value={prayerRemindersEnabled}
              onValueChange={() => {
                // togglePrayerReminders needs prayerTimes — simplified here
              }}
              trackColor={{false: '#555', true: palette.pinkStart}}
              thumbColor={palette.white}
            />
          </View>
          {!isPermissionGranted && (
            <View style={styles.permissionWarning}>
              <Text style={styles.permissionText}>
                Enable notifications in settings
              </Text>
              <TouchableOpacity onPress={handleOpenSettings}>
                <Text style={styles.openSettingsText}>Open Settings</Text>
              </TouchableOpacity>
            </View>
          )}
        </GlassCard>

        {/* Help & About */}
        <GlassCard style={styles.sectionCard}>
          <TouchableOpacity style={styles.menuItem}>
            <Icon name="help-circle-outline" size={20} color={palette.white} />
            <Text style={styles.menuText}>Help & Support</Text>
            <Icon
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.4)"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("AboutScreen", undefined)}>
            <Icon
              name="information-circle-outline"
              size={20}
              color={palette.white}
            />
            <Text style={styles.menuText}>About Noorbloom</Text>
            <Icon
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.4)"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Linking.openURL(
                'https://apps.apple.com/app/noorbloom/id0000000000',
              )
            }>
            <Icon name="star-outline" size={20} color={palette.white} />
            <Text style={styles.menuText}>Rate App</Text>
            <Icon
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.4)"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              Linking.openURL('https://noorbloom.app/privacy')
            }>
            <Icon
              name="shield-checkmark-outline"
              size={20}
              color={palette.white}
            />
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Icon
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.4)"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.menuItem, styles.menuItemLast]}
            onPress={() =>
              Linking.openURL('https://noorbloom.app/terms')
            }>
            <Icon
              name="document-text-outline"
              size={20}
              color={palette.white}
            />
            <Text style={styles.menuText}>Terms of Use</Text>
            <Icon
              name="chevron-forward"
              size={18}
              color="rgba(255,255,255,0.4)"
            />
          </TouchableOpacity>
        </GlassCard>

        {/* Auth actions */}
        {isAuthenticated && (
          <View style={styles.authActions}>
            <TouchableOpacity onPress={handleSignOut}>
              <Text style={styles.logoutText}>{t("auth.signOut")}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeleteAccount}>
              <Text style={styles.deleteText}>{t("auth.deleteAccount")}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Version */}
        <Text style={styles.version}>Noorbloom v1.0.0</Text>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
  },
  // Auth
  authCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  authText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.md,
  },
  avatarInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.white,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
    marginBottom: spacing.xs,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.6)',
  },
  signInBtn: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  signInGradient: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: 20,
  },
  signInText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.white,
  },
  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
    marginBottom: spacing.md,
  },
  // Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: '48%' as unknown as number,
    flexGrow: 1,
    flexBasis: '45%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '700',
    color: palette.white,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  // Plan
  planCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  planRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  planTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.6)',
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
    marginTop: spacing.xs,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  activeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1D9E75',
  },
  upgradeBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  upgradeBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.white,
  },
  usageContainer: {
    marginTop: spacing.md,
  },
  usageBarBg: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  usageBarFill: {
    height: 6,
    backgroundColor: palette.pinkStart,
    borderRadius: 3,
  },
  usageText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    marginTop: spacing.xs,
  },
  restoreBtn: {
    marginTop: spacing.sm,
    alignSelf: 'center',
  },
  restoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.pinkStart,
  },
  // Language
  sectionCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.white,
    marginBottom: spacing.md,
  },
  langRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  langBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  langBtnActive: {
    borderWidth: 2,
    borderColor: palette.pinkStart,
  },
  langFlag: {
    fontSize: 18,
  },
  langLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.white,
  },
  // Notifications
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.white,
  },
  permissionWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  permissionText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    flex: 1,
  },
  openSettingsText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.pinkStart,
  },
  // Menu items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: spacing.sm,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: palette.white,
  },
  // Auth actions
  authActions: {
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.5)',
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#E24B4A',
  },
  // Version
  version: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

export default ProfileScreen;
