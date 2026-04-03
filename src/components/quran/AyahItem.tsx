/**
 * AyahItem — Quran okuyucuda tek bir ayet satırı.
 * Arapça metin + çeviri + bookmark butonu.
 */

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {ArabicText} from '../../components';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {AyahDetail, AppLanguage} from '../../types';

interface AyahItemProps {
  ayah: AyahDetail;
  translation: AyahDetail;
  isBookmarked: boolean;
  onBookmark: () => void;
  language: AppLanguage;
  surahNumber: number;
}

function AyahItem({
  ayah,
  translation,
  isBookmarked,
  onBookmark,
  surahNumber,
}: AyahItemProps): React.JSX.Element {
  return (
    <View style={styles.container}>
      {/* Ayet numarası rozeti */}
      <View style={styles.badgeRow}>
        <View style={styles.ayahBadge}>
          <Text style={styles.ayahBadgeText}>{ayah.numberInSurah}</Text>
        </View>
      </View>

      {/* Arapça metin */}
      <View style={styles.arabicContainer}>
        <ArabicText text={ayah.text} size="large" />
      </View>

      {/* Çeviri */}
      <Text style={styles.translationText}>{translation.text}</Text>

      {/* Alt araç çubuğu */}
      <View style={styles.toolbar}>
        <Text style={styles.ayahRef}>
          {surahNumber}:{ayah.numberInSurah}
        </Text>

        <TouchableOpacity onPress={onBookmark} hitSlop={8}>
          <Ionicons
            name={isBookmarked ? 'heart' : 'heart-outline'}
            size={22}
            color={isBookmarked ? palette.pinkStart : 'rgba(255,255,255,0.5)'}
          />
        </TouchableOpacity>
      </View>

      {/* Separator */}
      <View style={styles.separator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  ayahBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.pinkEnd,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayahBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: palette.white,
  },
  arabicContainer: {
    paddingHorizontal: spacing.md,
  },
  translationText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 24,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
  },
  ayahRef: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginTop: spacing.md,
    marginHorizontal: spacing.md,
  },
});

export default React.memo(AyahItem);
