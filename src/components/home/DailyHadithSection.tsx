/**
 * DailyHadithSection — günlük hadis kartı.
 * Cam efekti arka plan, tırnak ikonu, kaynak bilgisi.
 */

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {LoadingSpinner} from '../../components';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {HadithData} from '../../types';

interface DailyHadithSectionProps {
  hadith: HadithData | null;
  isLoading: boolean;
  onRefresh: () => void;
}

function DailyHadithSection({
  hadith,
  isLoading,
  onRefresh,
}: DailyHadithSectionProps): React.JSX.Element {
  const {t} = useTranslation();

  return (
    <View style={styles.wrapper}>
      {/* Başlık satırı */}
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>DAILY HADITH</Text>
          <Text style={styles.subtitle}>From Sahih Sources</Text>
        </View>
        <TouchableOpacity onPress={onRefresh} hitSlop={12}>
          <Icon name="refresh-outline" size={20} color={palette.pinkStart} />
        </TouchableOpacity>
      </View>

      {/* Ana kart */}
      <View style={styles.card}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <LoadingSpinner />
          </View>
        ) : hadith ? (
          <>
            <Icon
              name="chatbubble-ellipses"
              size={28}
              color={palette.pinkStart}
              style={styles.quoteIcon}
            />
            <Text style={styles.hadithText}>{hadith.hadeeth}</Text>
            <Text style={styles.attribution}>— {hadith.attribution}</Text>
          </>
        ) : (
          <Text style={styles.placeholder}>
            {t('common.loading')}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.pinkStart,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.textSecondary,
    marginTop: 2,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  loadingContainer: {
    minHeight: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteIcon: {
    marginBottom: spacing.sm,
  },
  hadithText: {
    fontSize: 16,
    fontWeight: '500',
    color: palette.white,
    lineHeight: 24,
  },
  attribution: {
    fontSize: 14,
    fontStyle: 'italic',
    color: palette.textSecondary,
    marginTop: spacing.sm,
    textAlign: 'right',
  },
  placeholder: {
    fontSize: 15,
    fontWeight: '500',
    color: palette.textSecondary,
    textAlign: 'center',
    paddingVertical: spacing.lg,
  },
});

export default DailyHadithSection;
