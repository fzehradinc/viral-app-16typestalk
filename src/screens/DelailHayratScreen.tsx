/**
 * DelailHayratScreen — Salavat duaları, expand/collapse bölümler.
 */

import React, {useCallback, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {GradientBackground, GlassCard, ArabicText} from '../components';
import {useLanguageStore} from '../store/languageStore';
import {DELAIL_HAYRAT_SECTIONS} from '../utils/delailHayratContent';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import type {AppLanguage, DelailSection} from '../types';

function getSectionTitle(section: DelailSection, lang: AppLanguage): string {
  switch (lang) {
    case 'tr':
      return section.titleTr;
    case 'ru':
      return section.titleRu;
    default:
      return section.title;
  }
}

function getTranslation(section: DelailSection, lang: AppLanguage): string {
  switch (lang) {
    case 'tr':
      return section.translationTr;
    case 'ru':
      return section.translationRu;
    default:
      return section.translationEn;
  }
}

/** Tek bir expand/collapse salavat kartı */
function DelailCard({
  section,
  language,
}: {
  section: DelailSection;
  language: AppLanguage;
}): React.JSX.Element {
  const [expanded, setExpanded] = useState(false);
  const height = useSharedValue(0);
  const rotation = useSharedValue(0);

  const toggle = useCallback(() => {
    const next = !expanded;
    setExpanded(next);
    height.value = withTiming(next ? 1 : 0, {duration: 300});
    rotation.value = withTiming(next ? 1 : 0, {duration: 300});
  }, [expanded, height, rotation]);

  const contentStyle = useAnimatedStyle(() => ({
    maxHeight: height.value * 600,
    opacity: height.value,
    overflow: 'hidden' as const,
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{rotate: `${rotation.value * 180}deg`}],
  }));

  return (
    <GlassCard style={styles.card}>
      <TouchableOpacity
        onPress={toggle}
        style={styles.cardHeader}
        activeOpacity={0.7}>
        <View style={styles.cardTitles}>
          <Text style={styles.arabicTitle}>{section.title}</Text>
          <Text style={styles.localTitle}>
            {getSectionTitle(section, language)}
          </Text>
        </View>
        <Animated.View style={chevronStyle}>
          <Ionicons
            name="chevron-down"
            size={20}
            color={palette.textSecondary}
          />
        </Animated.View>
      </TouchableOpacity>

      <Animated.View style={contentStyle}>
        <View style={styles.cardBody}>
          <ArabicText text={section.content} size="medium" />
          <View style={styles.translationDivider} />
          <Text style={styles.translationText}>
            {getTranslation(section, language)}
          </Text>
        </View>
      </Animated.View>
    </GlassCard>
  );
}

function DelailHayratScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const {currentLanguage} = useLanguageStore();

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const title =
    currentLanguage === 'tr'
      ? 'Delail-i Hayrat'
      : currentLanguage === 'ru'
        ? 'Далаиль аль-Хайрат'
        : 'Dalail al-Khayrat';
  const subtitle =
    currentLanguage === 'tr'
      ? 'Salavat-ı Şerifeler'
      : 'Prayers of Blessings';

  const renderItem = useCallback(
    ({item}: {item: DelailSection}) => (
      <DelailCard section={item} language={currentLanguage} />
    ),
    [currentLanguage],
  );

  const keyExtractor = useCallback(
    (item: DelailSection) => item.id,
    [],
  );

  return (
    <View style={styles.root}>
      <GradientBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={palette.white} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{title}</Text>
            <Text style={styles.headerSubtitle}>{subtitle}</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <FlatList
          data={DELAIL_HAYRAT_SECTIONS}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: palette.textSecondary,
    marginTop: 2,
  },
  headerSpacer: {
    width: 26,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 120,
    gap: spacing.md,
  },
  card: {
    padding: 0,
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  cardTitles: {
    flex: 1,
    marginRight: spacing.sm,
  },
  arabicTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
    writingDirection: 'rtl',
    textAlign: 'right',
  },
  localTitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: spacing.xs,
  },
  cardBody: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  translationDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginVertical: spacing.sm,
  },
  translationText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 24,
  },
});

export default DelailHayratScreen;
