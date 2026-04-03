/**
 * AboutScreen — Noorbloom hakkında statik içerik.
 */

import React, {useCallback} from 'react';
import {Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {GradientBackground, GlassCard} from '../components';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';

function AboutScreen(): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const handleBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <GradientBackground>
      <ScrollView
        style={styles.root}
        contentContainerStyle={[
          styles.content,
          {paddingTop: insets.top + spacing.md, paddingBottom: insets.bottom + spacing.xxl},
        ]}
        showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backBtn}>
            <Icon name="chevron-back" size={24} color={palette.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>About Noorbloom</Text>
          <View style={styles.backBtn} />
        </View>

        {/* Logo / emoji */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>🌸</Text>
          <Text style={styles.appName}>Noorbloom</Text>
          <Text style={styles.tagline}>Your Spiritual Companion</Text>
        </View>

        {/* Description */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.paragraph}>
            Noorbloom is a beautiful, AI-powered Islamic companion app designed
            to nurture your spiritual journey. Whether you are reading the
            Quran, making dua, tracking your dhikr, or reflecting on your day —
            Noorbloom is here to guide you every step of the way.
          </Text>
        </GlassCard>

        {/* Our values */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valueItem}>
            <Text style={styles.valueEmoji}>🕌</Text>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Faith First</Text>
              <Text style={styles.valueDesc}>
                Every feature is built with Islamic principles at its core.
              </Text>
            </View>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueEmoji}>🔒</Text>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Privacy Matters</Text>
              <Text style={styles.valueDesc}>
                Your spiritual journey is personal. We never sell your data.
              </Text>
            </View>
          </View>
          <View style={styles.valueItem}>
            <Text style={styles.valueEmoji}>🌍</Text>
            <View style={styles.valueContent}>
              <Text style={styles.valueTitle}>Accessible to All</Text>
              <Text style={styles.valueDesc}>
                Available in English, Turkish, and Russian with more languages
                coming soon.
              </Text>
            </View>
          </View>
        </GlassCard>

        {/* Why we built Noorbloom */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Why We Built Noorbloom</Text>
          <Text style={styles.paragraph}>
            We believe that technology should bring us closer to our faith, not
            further away. Noorbloom combines the beauty of Islamic tradition
            with modern AI to create a personal, meaningful spiritual
            experience. Our goal is to make daily worship more accessible,
            engaging, and rewarding for Muslims around the world.
          </Text>
        </GlassCard>

        {/* Support */}
        <GlassCard style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Support Noorbloom</Text>
          <Text style={styles.paragraph}>
            If you love Noorbloom, consider supporting our mission to make
            Islamic apps beautiful and accessible.
          </Text>
          <TouchableOpacity
            style={styles.supportBtn}
            onPress={() =>
              Linking.openURL('https://buymeacoffee.com/noorbloom')
            }>
            <Text style={styles.supportBtnText}>☕ Buy Us a Coffee</Text>
          </TouchableOpacity>
        </GlassCard>

        {/* Version */}
        <Text style={styles.version}>Noorbloom v1.0.0</Text>
        <Text style={styles.copyright}>
          © {new Date().getFullYear()} Noorbloom. All rights reserved.
        </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  logoEmoji: {
    fontSize: 60,
    marginBottom: spacing.sm,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.white,
    marginBottom: spacing.xs,
  },
  tagline: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  sectionCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.white,
    marginBottom: spacing.md,
  },
  paragraph: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 22,
  },
  valueItem: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  valueEmoji: {
    fontSize: 24,
    marginTop: 2,
  },
  valueContent: {
    flex: 1,
  },
  valueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.white,
    marginBottom: spacing.xs,
  },
  valueDesc: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: 20,
  },
  supportBtn: {
    marginTop: spacing.md,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: 16,
  },
  supportBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: palette.white,
  },
  version: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  copyright: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
});

export default AboutScreen;
