/**
 * DailyVerseSection — günlük ayet kartı.
 * Arapça metin RTL, çeviri, sure rozeti, Wisdom / Share / Refresh butonları.
 */

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import ArabicText from '../common/ArabicText';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {AppLanguage, MotivationalQuranic} from '../../types';

interface DailyVerseSectionProps {
  verse: MotivationalQuranic | null;
  isLoading: boolean;
  currentLanguage: AppLanguage;
  onWisdomPress: () => void;
  onSharePress: () => void;
  onRefreshPress: () => void;
  isInterpreting: boolean;
}

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

function DailyVerseSection({
  verse,
  isLoading,
  currentLanguage,
  onWisdomPress,
  onSharePress,
  onRefreshPress,
  isInterpreting,
}: DailyVerseSectionProps): React.JSX.Element {
  const {t} = useTranslation();

  if (isLoading || !verse) {
    return (
      <View style={styles.wrapper}>
        <Text style={styles.label}>DIVINE GUIDANCE</Text>
        <LinearGradient
          colors={['#FFF0F0', '#F3F3FF']}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 1}}
          style={styles.card}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={palette.pinkEnd} />
          </View>
        </LinearGradient>
      </View>
    );
  }

  const translation = getVerseTranslation(verse, currentLanguage);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>DIVINE GUIDANCE</Text>

      <LinearGradient
        colors={['#FFF0F0', '#F3F3FF']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.card}>
        {/* Arapça metin */}
        <ArabicText
          text={verse.arabic}
          size="large"
          style={styles.arabicOverride}
        />

        {/* Çeviri */}
        <Text style={styles.translation}>{translation}</Text>

        {/* Sure rozeti */}
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {verse.surah} • {t('quran.ayah')} {verse.ayah}
            </Text>
          </View>
        </View>

        {/* Alt butonlar */}
        <View style={styles.actions}>
          <TouchableOpacity
            onPress={onWisdomPress}
            style={[styles.actionBtn, styles.wisdomBtn]}
            disabled={isInterpreting}>
            {isInterpreting ? (
              <ActivityIndicator size="small" color={palette.white} />
            ) : (
              <>
                <Icon name="sparkles" size={16} color={palette.white} />
                <Text style={styles.actionText}>Wisdom</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSharePress}
            style={[styles.actionBtn, styles.shareBtn]}>
            <Icon name="share-outline" size={16} color={palette.white} />
            <Text style={styles.actionText}>{t('common.share')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onRefreshPress}
            style={styles.refreshBtn}
            hitSlop={8}>
            <Icon name="refresh-outline" size={20} color={palette.pinkEnd} />
          </TouchableOpacity>
        </View>
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
    borderRadius: 32,
    padding: spacing.lg,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 6},
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loadingContainer: {
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arabicOverride: {
    color: '#1A0A2E',
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  translation: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#2D1B4E',
    lineHeight: 24,
    marginTop: spacing.md,
    textAlign: 'center',
  },
  badgeRow: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  badge: {
    backgroundColor: 'rgba(240,114,163,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: 16,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.pinkEnd,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    gap: spacing.xs,
  },
  wisdomBtn: {
    backgroundColor: palette.pinkEnd,
  },
  shareBtn: {
    backgroundColor: palette.purpleStart,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '600',
    color: palette.white,
  },
  refreshBtn: {
    padding: spacing.sm,
  },
});

export default DailyVerseSection;
