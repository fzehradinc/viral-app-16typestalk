/**
 * ReflectScreen — günlük tefekkür giriş ekranı + AI reflection üretimi.
 * Konu seçimi → metin girişi → mood seçimi → AI reflection.
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
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
import {useReflectionStore} from '../store/reflectionStore';
import {useSubscriptionStore} from '../store/subscriptionStore';
import {useLanguageStore} from '../store/languageStore';
import {palette, gradients} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import type {ReflectStackParamList} from '../navigation/types';

type Nav = NativeStackNavigationProp<ReflectStackParamList>;

const MAX_CONTENT = 1000;
const MIN_CONTENT = 10;

const TOPICS = [
  {key: 'gratitude', label: 'Gratitude', emoji: '🤲'},
  {key: 'forgiveness', label: 'Forgiveness', emoji: '💛'},
  {key: 'patience', label: 'Patience', emoji: '🕊️'},
  {key: 'trust', label: 'Trust', emoji: '🤝'},
  {key: 'growth', label: 'Growth', emoji: '🌱'},
  {key: 'remembrance', label: 'Remembrance', emoji: '📿'},
] as const;

const MOODS = [
  {key: 'grateful', label: 'Grateful', emoji: '😊'},
  {key: 'sad', label: 'Sad', emoji: '😔'},
  {key: 'anxious', label: 'Anxious', emoji: '😰'},
  {key: 'confident', label: 'Confident', emoji: '💪'},
  {key: 'heartbroken', label: 'Heartbroken', emoji: '💔'},
  {key: 'stressed', label: 'Stressed', emoji: '😤'},
  {key: 'lost', label: 'Lost', emoji: '🌫️'},
  {key: 'motivated', label: 'Motivated', emoji: '🌟'},
] as const;

function ReflectScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const {
    todayEntry,
    isGenerating,
    lastError,
    generateAndSaveReflection,
  } = useReflectionStore();
  const {canUseFeature} = useSubscriptionStore();
  const {currentLanguage} = useLanguageStore();

  const [selectedTopic, setSelectedTopic] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [copied, setCopied] = useState(false);

  // AI reflection animasyonu
  const reflectionOpacity = useSharedValue(0);
  const reflectionTranslateY = useSharedValue(20);

  // Bugün girdi varsa form alanlarını doldur
  useEffect(() => {
    if (todayEntry && !isEditing) {
      setSelectedTopic(todayEntry.topic);
      setContent(todayEntry.content);
      setSelectedMood(todayEntry.mood ?? '');
    }
  }, [todayEntry, isEditing]);

  // AI reflection üretildiğinde animasyon
  useEffect(() => {
    if (todayEntry?.aiReflection) {
      reflectionOpacity.value = 0;
      reflectionTranslateY.value = 20;
      reflectionOpacity.value = withTiming(1, {duration: 400});
      reflectionTranslateY.value = withTiming(0, {duration: 400});
    }
  }, [todayEntry?.aiReflection, reflectionOpacity, reflectionTranslateY]);

  useEffect(() => {
    if (lastError) {
      setShowError(true);
    }
  }, [lastError]);

  const reflectionAnimatedStyle = useAnimatedStyle(() => ({
    opacity: reflectionOpacity.value,
    transform: [{translateY: reflectionTranslateY.value}],
  }));

  const showForm = !todayEntry || isEditing;
  const canGenerate =
    selectedTopic !== '' && content.trim().length >= MIN_CONTENT;

  const handleGenerate = useCallback(async () => {
    if (!canUseFeature()) {
      setShowUpgradeModal(true);
      return;
    }
    Keyboard.dismiss();
    await generateAndSaveReflection(
      selectedTopic,
      content,
      currentLanguage,
      selectedMood || undefined,
    );
    setIsEditing(false);
  }, [
    canUseFeature,
    generateAndSaveReflection,
    selectedTopic,
    content,
    currentLanguage,
    selectedMood,
  ]);

  const handleShare = useCallback(async () => {
    const text = todayEntry?.aiReflection
      ? `${todayEntry.content}\n\n✨ ${todayEntry.aiReflection}`
      : todayEntry?.content ?? '';
    await Share.share({message: text});
  }, [todayEntry]);

  const handleCopy = useCallback(() => {
    const text = todayEntry?.aiReflection ?? todayEntry?.content ?? '';
    Clipboard.setString(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [todayEntry]);

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Reflect</Text>
            <TouchableOpacity
              style={styles.calendarButton}
              onPress={() => navigation.navigate('ReflectCalendar')}>
              <Ionicons
                name="calendar-outline"
                size={24}
                color={palette.white}
              />
            </TouchableOpacity>
          </View>

          {/* Error Banner */}
          {showError && lastError && (
            <TouchableOpacity
              style={styles.errorBanner}
              onPress={() => setShowError(false)}>
              <Ionicons
                name="alert-circle"
                size={18}
                color={palette.white}
              />
              <Text style={styles.errorText}>{lastError}</Text>
              <Ionicons name="close" size={16} color={palette.white} />
            </TouchableOpacity>
          )}

          {/* Today's Entry View */}
          {todayEntry && !showForm && (
            <View style={styles.entryView}>
              <Text style={styles.sectionTitle}>Today&apos;s Reflection</Text>

              <View style={styles.topicBadge}>
                <Text style={styles.topicBadgeText}>
                  {TOPICS.find(t => t.key === todayEntry.topic)?.emoji ?? '📿'}{' '}
                  {TOPICS.find(t => t.key === todayEntry.topic)?.label ??
                    todayEntry.topic}
                </Text>
              </View>

              <GlassCard style={styles.entryCard}>
                <Text style={styles.entryContent}>{todayEntry.content}</Text>
              </GlassCard>

              {todayEntry.aiReflection && (
                <Animated.View style={reflectionAnimatedStyle}>
                  <LinearGradient
                    colors={[...gradients.pink]}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    style={styles.aiCard}>
                    <View style={styles.aiHeader}>
                      <Ionicons
                        name="sparkles"
                        size={18}
                        color={palette.white}
                      />
                      <Text style={styles.aiTitle}>
                        Your Islamic Reflection
                      </Text>
                    </View>
                    <Text style={styles.aiText}>
                      {todayEntry.aiReflection}
                    </Text>
                  </LinearGradient>
                </Animated.View>
              )}

              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => setIsEditing(true)}>
                  <Ionicons
                    name="pencil-outline"
                    size={20}
                    color={palette.pinkStart}
                  />
                  <Text style={styles.actionLabel}>Edit</Text>
                </TouchableOpacity>
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
              </View>
            </View>
          )}

          {/* Entry Form */}
          {showForm && (
            <View style={styles.formContainer}>
              <Text style={styles.sectionTitle}>Entry Focus</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.topicScroll}
                contentContainerStyle={styles.topicScrollContent}>
                {TOPICS.map(topic => {
                  const isSelected = selectedTopic === topic.key;
                  return (
                    <TouchableOpacity
                      key={topic.key}
                      style={[
                        styles.topicPill,
                        isSelected && styles.topicPillSelected,
                      ]}
                      onPress={() => setSelectedTopic(topic.key)}>
                      <Text
                        style={[
                          styles.topicPillText,
                          isSelected && styles.topicPillTextSelected,
                        ]}>
                        {topic.emoji} {topic.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <Text style={styles.sectionTitle}>Your Thoughts</Text>
              <GlassCard style={styles.inputCard}>
                <TextInput
                  style={styles.textInput}
                  placeholder="Write your diary entry..."
                  placeholderTextColor={palette.textSecondary}
                  value={content}
                  onChangeText={setContent}
                  multiline
                  maxLength={MAX_CONTENT}
                  textAlignVertical="top"
                />
                <Text style={styles.charCounter}>
                  {content.length}/{MAX_CONTENT}
                </Text>
              </GlassCard>

              <Text style={styles.sectionTitle}>How are you feeling?</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.moodScroll}
                contentContainerStyle={styles.moodScrollContent}>
                {MOODS.map(mood => {
                  const isSelected = selectedMood === mood.key;
                  return (
                    <TouchableOpacity
                      key={mood.key}
                      style={[
                        styles.moodPill,
                        isSelected && styles.moodPillSelected,
                      ]}
                      onPress={() =>
                        setSelectedMood(prev =>
                          prev === mood.key ? '' : mood.key,
                        )
                      }>
                      <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                      <Text
                        style={[
                          styles.moodLabel,
                          isSelected && styles.moodLabelSelected,
                        ]}>
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              <View style={styles.privacyRow}>
                <Ionicons
                  name="lock-closed"
                  size={14}
                  color={palette.textSecondary}
                />
                <Text style={styles.privacyText}>
                  Your entries stay on device.
                </Text>
              </View>

              <PrimaryButton
                title="Generate Reflection"
                onPress={handleGenerate}
                disabled={!canGenerate}
                loading={isGenerating}
              />

              {isEditing && todayEntry && (
                <PrimaryButton
                  title="Cancel"
                  onPress={() => setIsEditing(false)}
                  variant="ghost"
                />
              )}
            </View>
          )}

          {isGenerating && !todayEntry?.aiReflection && (
            <GlassCard style={styles.generatingCard}>
              <Ionicons
                name="sparkles-outline"
                size={20}
                color={palette.pinkStart}
              />
              <Text style={styles.generatingText}>
                Generating your Islamic reflection...
              </Text>
            </GlassCard>
          )}
        </ScrollView>
        </KeyboardAvoidingView>
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
              for unlimited reflections.
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  headerTitle: {
    ...typography.title,
    color: palette.white,
  },
  calendarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.glass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,59,48,0.2)',
    borderRadius: 12,
    padding: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.caption,
    color: palette.white,
    flex: 1,
  },
  entryView: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    color: palette.white,
    marginBottom: spacing.sm,
  },
  topicBadge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.glass,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  topicBadgeText: {
    ...typography.caption,
    color: palette.pinkStart,
  },
  entryCard: {
    padding: spacing.md,
  },
  entryContent: {
    ...typography.body,
    color: palette.white,
  },
  aiCard: {
    borderRadius: 16,
    padding: spacing.md,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  aiTitle: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '600',
  },
  aiText: {
    ...typography.body,
    color: palette.white,
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
  formContainer: {
    gap: spacing.md,
  },
  topicScroll: {
    marginBottom: spacing.sm,
  },
  topicScrollContent: {
    gap: spacing.sm,
  },
  topicPill: {
    backgroundColor: palette.glass,
    borderRadius: 20,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  topicPillSelected: {
    backgroundColor: palette.pinkStart,
  },
  topicPillText: {
    ...typography.caption,
    color: palette.white,
  },
  topicPillTextSelected: {
    color: palette.white,
    fontWeight: '700',
  },
  inputCard: {
    padding: spacing.md,
  },
  textInput: {
    ...typography.body,
    color: palette.white,
    minHeight: 120,
    maxHeight: 240,
  },
  charCounter: {
    ...typography.small,
    color: palette.textSecondary,
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  moodScroll: {
    marginBottom: spacing.sm,
  },
  moodScrollContent: {
    gap: spacing.sm,
  },
  moodPill: {
    alignItems: 'center',
    backgroundColor: palette.glass,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minWidth: 70,
  },
  moodPillSelected: {
    backgroundColor: palette.pinkStart,
  },
  moodEmoji: {
    fontSize: 22,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    ...typography.small,
    color: palette.textSecondary,
  },
  moodLabelSelected: {
    color: palette.white,
    fontWeight: '600',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginVertical: spacing.sm,
  },
  privacyText: {
    ...typography.small,
    color: palette.textSecondary,
  },
  generatingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    marginTop: spacing.md,
  },
  generatingText: {
    ...typography.caption,
    color: palette.pinkStart,
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

export default ReflectScreen;
