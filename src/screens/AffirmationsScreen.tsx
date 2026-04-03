/**
 * AffirmationsScreen — mood seçimi + AI affirmation üretimi.
 * aiStore ile entegre, Reanimated fade-in animasyonu.
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import Clipboard from '@react-native-clipboard/clipboard';
import LinearGradient from 'react-native-linear-gradient';
import {GradientBackground, GlassCard, PrimaryButton} from '../components';
import {useAiStore} from '../store/aiStore';
import {useSubscriptionStore} from '../store/subscriptionStore';
import {useLanguageStore} from '../store/languageStore';
import {palette, gradients} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import type {HomeStackParamList} from '../navigation/types';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

const FREE_DAILY_LIMIT = 5;

const MOODS = [
  {key: 'Happy', emoji: '🌸', label: 'Happy'},
  {key: 'Sad', emoji: '🌧️', label: 'Sad'},
  {key: 'Anxious', emoji: '🌊', label: 'Anxious'},
  {key: 'Confident', emoji: '👑', label: 'Confident'},
  {key: 'Heartbroken', emoji: '❤️‍🩹', label: 'Heartbroken'},
  {key: 'Stressed', emoji: '🌬️', label: 'Stressed'},
  {key: 'Lost', emoji: '🌫️', label: 'Lost'},
  {key: 'Grateful', emoji: '🤲', label: 'Grateful'},
  {key: 'Depressed', emoji: '🌑', label: 'Depressed'},
  {key: 'Motivated', emoji: '✨', label: 'Motivated'},
] as const;

function AffirmationsScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const {
    dailyAffirmation,
    savedDailyMood,
    isGenerating,
    lastError,
    generateAndSaveAffirmation,
    loadSavedAffirmation,
  } = useAiStore();
  const {isPro, canUseFeature, usageToday, remainingUses} =
    useSubscriptionStore();
  const {currentLanguage} = useLanguageStore();

  const [selectedMood, setSelectedMood] = useState(savedDailyMood || 'Grateful');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Affirmation animasyonu
  const affOpacity = useSharedValue(0);
  const affTranslateY = useSharedValue(20);

  useEffect(() => {
    loadSavedAffirmation();
  }, [loadSavedAffirmation]);

  useEffect(() => {
    if (savedDailyMood) {
      setSelectedMood(savedDailyMood);
    }
  }, [savedDailyMood]);

  useEffect(() => {
    if (dailyAffirmation) {
      affOpacity.value = 0;
      affTranslateY.value = 20;
      affOpacity.value = withTiming(1, {duration: 500});
      affTranslateY.value = withTiming(0, {duration: 500});
    }
  }, [dailyAffirmation, affOpacity, affTranslateY]);

  const affAnimatedStyle = useAnimatedStyle(() => ({
    opacity: affOpacity.value,
    transform: [{translateY: affTranslateY.value}],
  }));

  const handleGenerate = useCallback(async () => {
    if (!canUseFeature()) {
      setShowUpgradeModal(true);
      return;
    }
    await generateAndSaveAffirmation(selectedMood, currentLanguage);
  }, [canUseFeature, generateAndSaveAffirmation, selectedMood, currentLanguage]);

  const handleCopy = useCallback(() => {
    Clipboard.setString(dailyAffirmation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [dailyAffirmation]);

  const handleShare = useCallback(async () => {
    await Share.share({
      message: `✨ ${dailyAffirmation}\n\n— Noorbloom`,
    });
  }, [dailyAffirmation]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Ionicons name="chevron-back" size={24} color={palette.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Affirmations</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Error banner */}
          {lastError && (
            <GlassCard style={styles.errorBanner}>
              <Ionicons name="alert-circle" size={18} color="#FF453A" />
              <Text style={styles.errorText}>
                {lastError === 'dailyLimitReached'
                  ? 'Daily limit reached. Upgrade for unlimited.'
                  : 'Could not generate. Please try again.'}
              </Text>
            </GlassCard>
          )}

          {/* Mood Selection */}
          <Text style={styles.sectionTitle}>Choose your mood</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            style={styles.moodScroll}
            contentContainerStyle={styles.moodScrollContent}>
            {MOODS.map(mood => {
              const isSelected = selectedMood === mood.key;
              return (
                <TouchableOpacity
                  key={mood.key}
                  onPress={() => setSelectedMood(mood.key)}>
                  {isSelected ? (
                    <LinearGradient
                      colors={[...gradients.pink]}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 1}}
                      style={styles.moodPill}>
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodLabelSelected}>{mood.label}</Text>
                    </LinearGradient>
                  ) : (
                    <View style={styles.moodPill}>
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text style={styles.moodLabel}>{mood.label}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Generate Button */}
          <PrimaryButton
            title={isGenerating ? 'Generating...' : 'Generate Affirmation'}
            onPress={handleGenerate}
            loading={isGenerating}
          />

          {/* Affirmation Card */}
          {dailyAffirmation !== '' && (
            <Animated.View style={affAnimatedStyle}>
              <GlassCard style={styles.affirmationCard}>
                <Text style={styles.affirmationEmoji}>
                  {MOODS.find(m => m.key === savedDailyMood)?.emoji ?? '✨'}
                </Text>
                <Text style={styles.affirmationText}>{dailyAffirmation}</Text>

                {/* Action toolbar */}
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleCopy}>
                    <Ionicons
                      name={copied ? 'checkmark' : 'copy-outline'}
                      size={20}
                      color={palette.pinkStart}
                    />
                    <Text style={styles.actionLabel}>
                      {copied ? 'Copied!' : 'Copy'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleShare}>
                    <Ionicons
                      name="share-outline"
                      size={20}
                      color={palette.pinkStart}
                    />
                    <Text style={styles.actionLabel}>Share</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={handleGenerate}>
                    <Ionicons
                      name="refresh-outline"
                      size={20}
                      color={palette.pinkStart}
                    />
                    <Text style={styles.actionLabel}>Refresh</Text>
                  </TouchableOpacity>
                </View>

                {/* Generated date note */}
                <Text style={styles.dateNote}>
                  Generated today • Refreshes tomorrow
                </Text>
              </GlassCard>
            </Animated.View>
          )}

          {/* Usage counter (free users) */}
          {!isPro && (
            <GlassCard style={styles.usageCard}>
              <Text style={styles.usageTitle}>
                {usageToday} / {FREE_DAILY_LIMIT} affirmations used today
              </Text>
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${Math.min(
                        (usageToday / FREE_DAILY_LIMIT) * 100,
                        100,
                      )}%`,
                    },
                  ]}
                />
              </View>
              <Text style={styles.usageSubtext}>
                {remainingUses > 0
                  ? `${remainingUses} remaining`
                  : 'Upgrade for unlimited'}
              </Text>
            </GlassCard>
          )}
        </ScrollView>
      </SafeAreaView>

      {/* Upgrade Modal */}
      <Modal
        visible={showUpgradeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowUpgradeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons name="lock-closed" size={40} color={palette.pinkStart} />
            <Text style={styles.modalTitle}>Daily Limit Reached</Text>
            <Text style={styles.modalMessage}>
              You&apos;ve used all free AI generations for today. Upgrade to Pro
              for unlimited affirmations.
            </Text>
            <PrimaryButton
              title="Maybe Later"
              onPress={() => setShowUpgradeModal(false)}
              variant="ghost"
            />
            <PrimaryButton
              title="Upgrade to Pro"
              onPress={() => setShowUpgradeModal(false)}
            />
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    ...typography.heading,
    color: palette.white,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: '#FF453A',
    flex: 1,
  },
  sectionTitle: {
    ...typography.heading,
    color: palette.white,
  },
  moodScroll: {
    flexGrow: 0,
  },
  moodScrollContent: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  moodPill: {
    alignItems: 'center',
    backgroundColor: palette.glass,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 76,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    ...typography.small,
    color: palette.textSecondary,
  },
  moodLabelSelected: {
    ...typography.small,
    color: palette.white,
    fontWeight: '600',
  },
  affirmationCard: {
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
  },
  affirmationEmoji: {
    fontSize: 48,
  },
  affirmationText: {
    ...typography.heading,
    color: palette.white,
    textAlign: 'center',
    lineHeight: 30,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: palette.glass,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  actionLabel: {
    ...typography.caption,
    color: palette.pinkStart,
  },
  dateNote: {
    ...typography.small,
    color: 'rgba(255,255,255,0.5)',
  },
  usageCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  usageTitle: {
    ...typography.caption,
    color: palette.white,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: palette.glass,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: 6,
    backgroundColor: palette.pinkStart,
    borderRadius: 3,
  },
  usageSubtext: {
    ...typography.small,
    color: palette.textSecondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  modalContent: {
    backgroundColor: palette.backgroundDark,
    borderRadius: 20,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    width: '100%',
  },
  modalTitle: {
    ...typography.heading,
    color: palette.white,
  },
  modalMessage: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
  },
});

export default AffirmationsScreen;
