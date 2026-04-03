/**
 * SurahRow — sure listesinde tek bir satır.
 */

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {SurahSummary} from '../../types';

interface SurahRowProps {
  surah: SurahSummary;
  onPress: () => void;
}

function SurahRow({surah, onPress}: SurahRowProps): React.JSX.Element {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Sol — numara rozeti */}
      <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{surah.number}</Text>
      </View>

      {/* Orta sol — İngilizce isim + açıklama */}
      <View style={styles.nameContainer}>
        <Text style={styles.englishName} numberOfLines={1}>
          {surah.englishName}
        </Text>
        <Text style={styles.translation} numberOfLines={1}>
          {surah.englishNameTranslation}
        </Text>
      </View>

      {/* Orta sağ — Arapça isim */}
      <Text style={styles.arabicName}>{surah.name}</Text>

      {/* En sağ — ayet sayısı + tür */}
      <View style={styles.metaContainer}>
        <Text style={styles.metaText}>{surah.numberOfAyahs} ayat</Text>
        <Text style={styles.metaText}>{surah.revelationType}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  numberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.pinkEnd,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  numberText: {
    fontSize: 14,
    fontWeight: '700',
    color: palette.white,
  },
  nameContainer: {
    flex: 1,
    marginRight: spacing.sm,
  },
  englishName: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.white,
  },
  translation: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 2,
  },
  arabicName: {
    fontSize: 18,
    color: palette.white,
    textAlign: 'right',
    marginRight: spacing.sm,
    writingDirection: 'rtl',
  },
  metaContainer: {
    alignItems: 'flex-end',
    minWidth: 56,
  },
  metaText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.5)',
  },
});

export default SurahRow;
