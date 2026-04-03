/**
 * SubscriptionScreen — RevenueCat plan seçimi + satın alma.
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  GradientBackground,
  GlassCard,
  PrimaryButton,
} from '../components';
import {useSubscriptionStore} from '../store/subscriptionStore';
import {useAuthStore} from '../store/authStore';
import {useTranslation} from '../hooks/useTranslation';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import type {RootStackParamList} from '../navigation/types';

type RootNav = NativeStackNavigationProp<RootStackParamList>;

function SubscriptionScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const rootNav = useNavigation<RootNav>();
  const {t} = useTranslation();
  const {isAuthenticated} = useAuthStore();
  const {
    packages,
    currentPlan,
    isPro,
    isLoadingPackages,
    isPurchasing,
    purchasePlan,
    restorePurchases,
    fetchPackages,
  } = useSubscriptionStore();

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  useEffect(() => {
    if (packages.length === 0) {
      fetchPackages();
    }
  }, [packages.length, fetchPackages]);

  const monthlyPkg = packages.find(p =>
    p.product.identifier.includes('monthly'),
  );
  const yearlyPkg = packages.find(p =>
    p.product.identifier.includes('yearly'),
  );

  const handlePurchase = useCallback(async () => {
    if (!isAuthenticated) {
      rootNav.navigate('Login');
      return;
    }
    const pkg = selectedPlan === 'yearly' ? yearlyPkg : monthlyPkg;
    if (!pkg) {
      return;
    }
    const success = await purchasePlan(pkg);
    if (success) {
      navigation.goBack();
    }
  }, [
    isAuthenticated,
    rootNav,
    selectedPlan,
    yearlyPkg,
    monthlyPkg,
    purchasePlan,
    navigation,
  ]);

  const handleRestore = useCallback(async () => {
    await restorePurchases();
  }, [restorePurchases]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleManageSubscription = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('https://apps.apple.com/account/subscriptions');
    } else {
      Linking.openURL(
        'https://play.google.com/store/account/subscriptions',
      );
    }
  }, []);

  const FEATURES = [
    {icon: 'infinite-outline' as const, text: t('subscription.unlimitedDuas')},
    {icon: 'heart-outline' as const, text: t('subscription.fullMoodTracking')},
    {icon: 'sparkles-outline' as const, text: t('subscription.unlimitedAffirmations')},
    {icon: 'book-outline' as const, text: t('subscription.verseInterpretations')},
    {icon: 'ban-outline' as const, text: t('subscription.noAds')},
    {icon: 'headset-outline' as const, text: t('subscription.prioritySupport')},
  ];

  // Already pro — show management banner
  if (isPro) {
    return (
      <View style={styles.root}>
        <GradientBackground />
        <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={28} color={palette.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.proCenter}>
            <Text style={styles.proEmoji}>✨</Text>
            <Text style={styles.proTitle}>{t('subscription.proMember')}</Text>
            <Text style={styles.proSubtitle}>
              {t('subscription.currentPlan')}: {currentPlan === 'monthly' ? t('subscription.monthly') : t('subscription.yearly')}
            </Text>
            <PrimaryButton
              title={t('subscription.manageSubscription')}
              onPress={handleManageSubscription}
              variant="secondary"
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <GradientBackground />
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerSpacer} />
            <TouchableOpacity onPress={handleClose} hitSlop={8}>
              <Ionicons name="close" size={28} color={palette.white} />
            </TouchableOpacity>
          </View>

          {/* Hero */}
          <View style={styles.hero}>
            <Text style={styles.heroEmoji}>✨</Text>
            <Text style={styles.heroTitle}>
              {t('subscription.upgrade')}
            </Text>
            <Text style={styles.heroSubtitle}>
              {t('subscription.unlockDesc')}
            </Text>
            <Text style={styles.heroNote}>
              {t('subscription.cancelAnytime')}
            </Text>
          </View>

          {/* Plan cards */}
          <View style={styles.plansContainer}>
            {/* Yearly card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedPlan('yearly')}>
              <GlassCard
                style={[
                  styles.planCard,
                  selectedPlan === 'yearly' && styles.planCardSelected,
                ]}>
                <View style={styles.planBadgeRow}>
                  <View style={styles.bestValueBadge}>
                    <Text style={styles.bestValueText}>
                      {t('subscription.bestValue')}
                    </Text>
                  </View>
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveText}>
                      {t('subscription.save50')}
                    </Text>
                  </View>
                </View>
                <Text style={styles.planName}>
                  {t('subscription.yearly')}
                </Text>
                {isLoadingPackages ? (
                  <View style={styles.priceSkeleton} />
                ) : yearlyPkg ? (
                  <Text style={styles.planPrice}>
                    {yearlyPkg.product.priceString}/{t('subscription.year')}
                  </Text>
                ) : (
                  <Text style={styles.planPrice}>—</Text>
                )}
              </GlassCard>
            </TouchableOpacity>

            {/* Monthly card */}
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => setSelectedPlan('monthly')}>
              <GlassCard
                style={[
                  styles.planCard,
                  selectedPlan === 'monthly' && styles.planCardSelected,
                ]}>
                <Text style={styles.planName}>
                  {t('subscription.monthly')}
                </Text>
                {isLoadingPackages ? (
                  <View style={styles.priceSkeleton} />
                ) : monthlyPkg ? (
                  <Text style={styles.planPrice}>
                    {monthlyPkg.product.priceString}/{t('subscription.month')}
                  </Text>
                ) : (
                  <Text style={styles.planPrice}>—</Text>
                )}
              </GlassCard>
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            {FEATURES.map(feature => (
              <View style={styles.featureRow} key={feature.icon}>
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={palette.pinkStart}
                />
                <Text style={styles.featureText}>{feature.text}</Text>
              </View>
            ))}
          </View>

          {/* Subscribe button */}
          <View style={styles.ctaContainer}>
            <PrimaryButton
              title={
                isPurchasing
                  ? t('subscription.processing')
                  : t('subscription.subscribeNow')
              }
              onPress={handlePurchase}
              loading={isPurchasing}
              disabled={isPurchasing || (!monthlyPkg && !yearlyPkg)}
            />
            {!isAuthenticated && (
              <Text style={styles.signInWarning}>
                {t('subscription.signInToSubscribe')}
              </Text>
            )}
          </View>

          {/* Restore */}
          <PrimaryButton
            title={t('subscription.restore')}
            onPress={handleRestore}
            variant="ghost"
          />

          {/* Legal */}
          <Text style={styles.legalText}>
            {t('subscription.legalText')}
          </Text>
          <View style={styles.legalLinks}>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://noorbloom.app/privacy')
              }>
              <Text style={styles.legalLink}>
                {t('subscription.privacyPolicy')}
              </Text>
            </TouchableOpacity>
            <Text style={styles.legalDivider}>•</Text>
            <TouchableOpacity
              onPress={() =>
                Linking.openURL('https://noorbloom.app/terms')
              }>
              <Text style={styles.legalLink}>
                {t('subscription.termsOfUse')}
              </Text>
            </TouchableOpacity>
          </View>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  headerSpacer: {
    flex: 1,
  },
  // Hero
  hero: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  heroEmoji: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: palette.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    fontSize: 15,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xs,
  },
  heroNote: {
    fontSize: 13,
    color: palette.pinkStart,
    fontWeight: '600',
  },
  // Plans
  plansContainer: {
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  planCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  planCardSelected: {
    borderWidth: 2,
    borderColor: palette.pinkStart,
  },
  planBadgeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  bestValueBadge: {
    backgroundColor: palette.pinkStart,
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  bestValueText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.white,
  },
  saveBadge: {
    backgroundColor: 'rgba(29,158,117,0.2)',
    borderRadius: 8,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  saveText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1D9E75',
  },
  planName: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
    marginBottom: spacing.xs,
  },
  planPrice: {
    fontSize: 15,
    fontWeight: '500',
    color: palette.textSecondary,
  },
  priceSkeleton: {
    width: 100,
    height: 18,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  // Features
  featuresContainer: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  featureText: {
    fontSize: 15,
    fontWeight: '500',
    color: palette.white,
  },
  // CTA
  ctaContainer: {
    marginBottom: spacing.md,
  },
  signInWarning: {
    fontSize: 13,
    color: '#F5A623',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  // Legal
  legalText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 16,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  legalLink: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
    textDecorationLine: 'underline',
  },
  legalDivider: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
  // Pro state
  proCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.md,
  },
  proEmoji: {
    fontSize: 64,
  },
  proTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.white,
  },
  proSubtitle: {
    fontSize: 15,
    color: palette.textSecondary,
    marginBottom: spacing.md,
  },
});

export default SubscriptionScreen;
