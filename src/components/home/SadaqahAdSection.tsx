/**
 * SadaqahAdSection — reklam izle & sadaka kartı.
 * Sadece free kullanıcılar görür (HomeScreen kontrol eder).
 */

import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {AppLanguage} from '../../types';

interface SadaqahAdSectionProps {
  onWatchAd: () => void;
  currentLanguage: AppLanguage;
}

function SadaqahAdSection({
  onWatchAd,
  currentLanguage: _currentLanguage,
}: SadaqahAdSectionProps): React.JSX.Element {
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <Text style={styles.title}>Watch &amp; Give Sadaqah</Text>
        <Text style={styles.description}>
          Watch a short video and we donate to charity on your behalf.
        </Text>

        {/* Katılımcı sayısı */}
        <View style={styles.participantsRow}>
          <View style={styles.avatarGroup}>
            <View style={[styles.miniAvatar, styles.avatar1]} />
            <View style={[styles.miniAvatar, styles.avatar2]} />
          </View>
          <Text style={styles.participantsText}>
            30,596 people giving Sadaqah
          </Text>
        </View>

        {/* CTA butonu */}
        <TouchableOpacity onPress={onWatchAd} style={styles.ctaButton}>
          <Icon name="play-circle" size={20} color={palette.white} />
          <Text style={styles.ctaText}>Watch &amp; Give Sadaqah</Text>
        </TouchableOpacity>

        {/* Alt bilgi */}
        <View style={styles.footerRow}>
          <Icon name="moon-outline" size={14} color={palette.textSecondary} />
          <Text style={styles.footerText}>Given to verified charity</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.lg,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    gap: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: palette.textSecondary,
    lineHeight: 20,
  },
  participantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarGroup: {
    flexDirection: 'row',
  },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  avatar1: {
    backgroundColor: palette.pinkStart,
    zIndex: 1,
  },
  avatar2: {
    backgroundColor: palette.purpleStart,
    marginLeft: -8,
  },
  participantsText: {
    fontSize: 12,
    fontWeight: '500',
    color: palette.textSecondary,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00A657',
    paddingVertical: spacing.sm + 4,
    borderRadius: 20,
    gap: spacing.sm,
  },
  ctaText: {
    fontSize: 15,
    fontWeight: '700',
    color: palette.white,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400',
    color: palette.textSecondary,
  },
});

export default SadaqahAdSection;
