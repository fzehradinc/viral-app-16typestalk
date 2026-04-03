/**
 * DuaScreen — AI dua üretici ana ekran.
 * Form (isim + niyet) → üret → paylaş / kaydet.
 */

import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Vibration,
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
import {GradientBackground, GlassCard, PrimaryButton} from '../components';
import {useDuaStore} from '../store/duaStore';
import {useSubscriptionStore} from '../store/subscriptionStore';
import {useLanguageStore} from '../store/languageStore';
import {useStreakStore} from '../store/streakStore';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import type {SavedDua} from '../types';
import type {DuaStackParamList} from '../navigation/types';

type Nav = NativeStackNavigationProp<DuaStackParamList>;
const MAX_INTENTION = 200;

function DuaScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const {
    recipientName,
    intention,
    generatedDua,
    isGenerating,
    lastError,
    savedDuas,
    canGenerateDua,
    setRecipientName,
    setIntention,
    generateDuaAction,
    saveDua,
    deleteDua,
  } = useDuaStore();
  const {isPro} = useSubscriptionStore();
  const {currentLanguage} = useLanguageStore();
  const recordActivity = useStreakStore(s => s.recordActivity);

  const [showLimitModal, setShowLimitModal] = useState(false);
  const [showSavedDuas, setShowSavedDuas] = useState(false);
  const [duaSaved, setDuaSaved] = useState(false);
  const [showError, setShowError] = useState(false);

  // Dua üretilince animasyon
  const duaOpacity = useSharedValue(0);
  const duaTranslateY = useSharedValue(20);

  useEffect(() => {
    if (generatedDua) {
      duaOpacity.value = 0;
      duaTranslateY.value = 20;
      duaOpacity.value = withTiming(1, {duration: 400});
      duaTranslateY.value = withTiming(0, {duration: 400});
    }
  }, [generatedDua, duaOpacity, duaTranslateY]);

  useEffect(() => {
    if (lastError) {
      setShowError(true);
    }
  }, [lastError]);

  const duaAnimatedStyle = useAnimatedStyle(() => ({
    opacity: duaOpacity.value,
    transform: [{translateY: duaTranslateY.value}],
  }));

  // ── handlers ──

  const handleGenerate = useCallback(async () => {
    if (!canGenerateDua()) {
      setShowLimitModal(true);
      return;
    }
    Keyboard.dismiss();
    await generateDuaAction(currentLanguage);
  }, [canGenerateDua, generateDuaAction, currentLanguage]);

  const handleSave = useCallback(() => {
    if (duaSaved || !generatedDua) {
      return;
    }
    saveDua(generatedDua, recipientName, currentLanguage);
    recordActivity('dua');
    setDuaSaved(true);
    try {
      Vibration.vibrate(50);
    } catch {
      // silent
    }
    setTimeout(() => setDuaSaved(false), 2000);
  }, [
    duaSaved,
    generatedDua,
    saveDua,
    recipientName,
    currentLanguage,
    recordActivity,
  ]);

  const handleShare = useCallback(() => {
    if (!generatedDua) {
      return;
    }
    navigation.navigate('DuaShare', {
      dua: generatedDua,
      recipientName,
      language: currentLanguage,
    });
  }, [generatedDua, navigation, recipientName, currentLanguage]);

  const handleRegenerate = useCallback(async () => {
    if (!canGenerateDua()) {
      setShowLimitModal(true);
      return;
    }
    await generateDuaAction(currentLanguage);
  }, [canGenerateDua, generateDuaAction, currentLanguage]);

  const handleSavedDuaPress = useCallback(
    (item: SavedDua) => {
      setShowSavedDuas(false);
      navigation.navigate('DuaShare', {
        dua: item.dua,
        recipientName: item.recipientName,
        language: item.language,
      });
    },
    [navigation],
  );

  const titleText =
    currentLanguage === 'tr' ? 'Dua' : currentLanguage === 'ru' ? 'Дуа' : 'Dua';
  const whoLabel =
    currentLanguage === 'tr'
      ? 'Bu dua kimin için?'
      : 'Who is this dua for?';
  const intentionLabel =
    currentLanguage === 'tr'
      ? 'Ne için dua edilecek?'
      : 'What do they need dua for?';
  const namePlaceholder =
    currentLanguage === 'tr' ? 'İsim girin' : 'Enter their name';
  const intentionPlaceholder =
    currentLanguage === 'tr'
      ? 'Örn: Sağlık, huzur, başarı...'
      : 'e.g. Health, peace, success...';
  const generateLabel = isGenerating
    ? currentLanguage === 'tr'
      ? 'Oluşturuluyor...'
      : 'Generating...'
    : currentLanguage === 'tr'
      ? 'Dua Oluştur'
      : 'Generate Dua';

  const canGenerate =
    recipientName.trim() !== '' &&
    intention.trim() !== '' &&
    !isGenerating;

  return (
    <View style={styles.root}>
      <GradientBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>{titleText}</Text>
              <View style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>AI</Text>
              </View>
            </View>
            {savedDuas.length > 0 && (
              <TouchableOpacity
                onPress={() => setShowSavedDuas(true)}
                hitSlop={8}
                style={styles.historyBtn}>
                <Ionicons
                  name="time-outline"
                  size={24}
                  color={palette.white}
                />
                <View style={styles.historyBadge}>
                  <Text style={styles.historyBadgeText}>
                    {savedDuas.length}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Hata banner */}
          {showError && lastError && (
            <View style={styles.errorBanner}>
              <Ionicons
                name="warning-outline"
                size={18}
                color={palette.white}
              />
              <Text style={styles.errorText}>
                {lastError === 'dailyLimitReached'
                  ? currentLanguage === 'tr'
                    ? 'Günlük limit doldu'
                    : 'Daily limit reached'
                  : currentLanguage === 'tr'
                    ? 'Dua oluşturulamadı'
                    : 'Failed to generate dua'}
              </Text>
              <TouchableOpacity
                onPress={() => setShowError(false)}
                hitSlop={8}>
                <Ionicons
                  name="close"
                  size={18}
                  color={palette.white}
                />
              </TouchableOpacity>
            </View>
          )}

          {/* Kart 1 — İsim */}
          <GlassCard style={styles.inputCard}>
            <Text style={styles.inputLabel}>{whoLabel}</Text>
            <TextInput
              style={styles.textInput}
              placeholder={namePlaceholder}
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={recipientName}
              onChangeText={setRecipientName}
              maxLength={50}
              returnKeyType="next"
            />
          </GlassCard>

          {/* Kart 2 — Niyet */}
          <GlassCard style={styles.inputCard}>
            <Text style={styles.inputLabel}>{intentionLabel}</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder={intentionPlaceholder}
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={intention}
              onChangeText={setIntention}
              maxLength={MAX_INTENTION}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={styles.charCount}>
              {intention.length}/{MAX_INTENTION}
            </Text>
          </GlassCard>

          {/* Gizlilik notu */}
          <Text style={styles.privacyNote}>
            {currentLanguage === 'tr'
              ? 'Sadece paylaşma izniniz olan bilgileri girin. Saklanmaz.'
              : 'Only enter info you have permission to share. Not stored.'}
          </Text>

          {/* Generate butonu */}
          <PrimaryButton
            title={generateLabel}
            onPress={handleGenerate}
            disabled={!canGenerate}
            loading={isGenerating}
          />

          {/* Üretilen dua */}
          {generatedDua && (
            <Animated.View style={duaAnimatedStyle}>
              <GlassCard style={styles.duaCard}>
                <Text style={styles.duaTitle}>
                  {currentLanguage === 'tr'
                    ? `${recipientName} için Duanız`
                    : `Your Dua for ${recipientName}`}
                </Text>
                <Text style={styles.duaText}>{generatedDua}</Text>
              </GlassCard>

              {/* Aksiyon butonları */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.shareBtn}
                  onPress={handleShare}
                  activeOpacity={0.8}>
                  <Ionicons
                    name="share-outline"
                    size={18}
                    color={palette.white}
                  />
                  <Text style={styles.actionBtnText}>
                    {currentLanguage === 'tr' ? 'Paylaş' : 'Share'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveBtn}
                  onPress={handleSave}
                  activeOpacity={0.8}>
                  <Ionicons
                    name={duaSaved ? 'checkmark-circle' : 'bookmark-outline'}
                    size={18}
                    color={palette.white}
                  />
                  <Text style={styles.actionBtnText}>
                    {duaSaved
                      ? currentLanguage === 'tr'
                        ? 'Kaydedildi'
                        : 'Saved!'
                      : currentLanguage === 'tr'
                        ? 'Kaydet'
                        : 'Save'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.refreshBtn}
                  onPress={handleRegenerate}
                  activeOpacity={0.8}>
                  <Ionicons
                    name="refresh-outline"
                    size={20}
                    color={palette.white}
                  />
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>
        </KeyboardAvoidingView>

        {/* ── Geçmiş Dualar Modal ── */}
        <Modal
          visible={showSavedDuas}
          animationType="slide"
          transparent
          onRequestClose={() => setShowSavedDuas(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {currentLanguage === 'tr' ? 'Geçmiş Dualar' : 'Recent Duas'}
                </Text>
                <TouchableOpacity
                  onPress={() => setShowSavedDuas(false)}
                  hitSlop={8}>
                  <Ionicons
                    name="close"
                    size={24}
                    color={palette.white}
                  />
                </TouchableOpacity>
              </View>
              <FlatList
                data={savedDuas}
                keyExtractor={item => item.id}
                renderItem={({item}) => (
                  <TouchableOpacity
                    style={styles.savedItem}
                    onPress={() => handleSavedDuaPress(item)}
                    activeOpacity={0.7}>
                    <View style={styles.savedItemHeader}>
                      <Text style={styles.savedName} numberOfLines={1}>
                        {item.recipientName}
                      </Text>
                      <TouchableOpacity
                        onPress={() => deleteDua(item.id)}
                        hitSlop={8}>
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="rgba(255,255,255,0.5)"
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.savedDate}>
                      {new Date(item.createdAt).toLocaleDateString()}
                    </Text>
                    <Text style={styles.savedDua} numberOfLines={2}>
                      {item.dua}
                    </Text>
                  </TouchableOpacity>
                )}
                contentContainerStyle={styles.savedList}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
        </Modal>

        {/* ── Limit Modal ── */}
        <Modal
          visible={showLimitModal}
          animationType="fade"
          transparent
          onRequestClose={() => setShowLimitModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.limitModalContent}>
              <Text style={styles.limitTitle}>
                {currentLanguage === 'tr'
                  ? 'Günlük Limit Doldu'
                  : 'Daily Limit Reached'}
              </Text>
              <Text style={styles.limitMessage}>
                {isPro
                  ? ''
                  : currentLanguage === 'tr'
                    ? 'Bugünlük dua hakkınız doldu. Yarın tekrar deneyin veya Premium alın.'
                    : 'You have reached the daily dua limit. Try again tomorrow or upgrade to Premium.'}
              </Text>
              <PrimaryButton
                title={
                  currentLanguage === 'tr'
                    ? 'Yarına Bekle'
                    : 'Wait Until Tomorrow'
                }
                onPress={() => setShowLimitModal(false)}
                variant="ghost"
              />
              {!isPro && (
                <PrimaryButton
                  title={
                    currentLanguage === 'tr'
                      ? "Premium'a Yükselt"
                      : 'Upgrade to Premium'
                  }
                  onPress={() => {
                    setShowLimitModal(false);
                    // TODO: Faz 5 — Subscription ekranına yönlendir
                  }}
                />
              )}
            </View>
          </View>
        </Modal>
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.white,
  },
  aiBadge: {
    backgroundColor: palette.purpleStart,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  aiBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.white,
  },
  historyBtn: {
    position: 'relative',
  },
  historyBadge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: palette.pinkEnd,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  historyBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: palette.white,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(220,38,38,0.8)',
    borderRadius: 12,
    padding: spacing.sm,
    gap: spacing.sm,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: palette.white,
  },
  inputCard: {
    padding: spacing.md,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.textSecondary,
    marginBottom: spacing.sm,
  },
  textInput: {
    fontSize: 16,
    color: palette.white,
    paddingVertical: 0,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'right',
    marginTop: spacing.xs,
  },
  privacyNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  duaCard: {
    padding: spacing.lg,
  },
  duaTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.pinkStart,
    marginBottom: spacing.sm,
  },
  duaText: {
    fontSize: 16,
    color: palette.white,
    lineHeight: 24,
  },
  actionRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  shareBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: palette.purpleStart,
    borderRadius: 14,
    paddingVertical: 12,
  },
  saveBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: palette.glass,
    borderRadius: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  refreshBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.glass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.white,
  },
  bottomSpacer: {
    height: 120,
  },
  // ── Modals ──
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: palette.backgroundDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
    paddingBottom: spacing.xxl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
  },
  savedList: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  savedItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  savedItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  savedName: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.white,
    flex: 1,
    marginRight: spacing.sm,
  },
  savedDate: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  savedDua: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  limitModalContent: {
    backgroundColor: palette.backgroundDark,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.md,
  },
  limitTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.white,
    textAlign: 'center',
  },
  limitMessage: {
    fontSize: 15,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default DuaScreen;
