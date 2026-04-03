/**
 * DhikrListScreen — dhikr kategorileri listesi.
 * Her dhikr'e tıklanınca DhikrMaticScreen açılır.
 */

import React, {useMemo, useState} from 'react';
import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {GradientBackground, GlassCard, ArabicText} from '../components';
import {dhikrList, DHIKR_CATEGORIES} from '../utils/dhikrData';
import type {DhikrCategory} from '../utils/dhikrData';
import {useLanguageStore} from '../store/languageStore';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import type {HomeStackParamList} from '../navigation/types';
import type {DhikrItem} from '../types';

type Nav = NativeStackNavigationProp<HomeStackParamList>;

function getMeaning(item: DhikrItem, lang: string): string {
  switch (lang) {
    case 'tr':
      return item.meaningTr;
    case 'ru':
      return item.meaningRu;
    default:
      return item.meaningEn;
  }
}

function DhikrCard({
  item,
  language,
  onPress,
}: {
  item: DhikrItem;
  language: string;
  onPress: () => void;
}): React.JSX.Element {
  return (
    <GlassCard style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.cardLeft}>
          <ArabicText text={item.arabic} size="medium" />
          <Text style={styles.transliteration}>{item.transliteration}</Text>
          <Text style={styles.meaning} numberOfLines={2}>
            {getMeaning(item, language)}
          </Text>
        </View>
        <View style={styles.cardRight}>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{item.targetCount}</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={palette.textSecondary} />
        </View>
      </View>
    </GlassCard>
  );
}

function DhikrListScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const {currentLanguage} = useLanguageStore();
  const [activeCategory, setActiveCategory] = useState<DhikrCategory | 'all'>(
    'all',
  );

  const filteredDhikrs = useMemo(() => {
    if (activeCategory === 'all') {
      return dhikrList;
    }
    return dhikrList.filter(d => d.category === activeCategory);
  }, [activeCategory]);

  const handleDhikrPress = (item: DhikrItem) => {
    navigation.navigate('DhikrMatic', {
      initialCount: 0,
      dhikrItem: item,
    });
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={palette.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Dhikr</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Category filters */}
        <FlatList
          horizontal
          data={DHIKR_CATEGORIES}
          keyExtractor={c => c.key}
          showsHorizontalScrollIndicator={false}
          style={styles.categoryList}
          contentContainerStyle={styles.categoryContent}
          renderItem={({item: cat}) => {
            const isActive = activeCategory === cat.key;
            return (
              <TouchableOpacity
                style={[
                  styles.categoryPill,
                  isActive && styles.categoryPillActive,
                ]}
                onPress={() => setActiveCategory(cat.key)}>
                <Text
                  style={[
                    styles.categoryLabel,
                    isActive && styles.categoryLabelActive,
                  ]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />

        {/* Dhikr list */}
        <FlatList
          data={filteredDhikrs}
          keyExtractor={d => d.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => (
            <DhikrCard
              item={item}
              language={currentLanguage}
              onPress={() => handleDhikrPress(item)}
            />
          )}
        />
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.md,
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
  categoryList: {
    flexGrow: 0,
    marginBottom: spacing.md,
  },
  categoryContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  categoryPill: {
    backgroundColor: palette.glass,
    borderRadius: 16,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  categoryPillActive: {
    backgroundColor: palette.pinkStart,
  },
  categoryLabel: {
    ...typography.caption,
    color: palette.textSecondary,
  },
  categoryLabelActive: {
    color: palette.white,
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
    gap: spacing.sm,
  },
  card: {
    padding: spacing.md,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardLeft: {
    flex: 1,
    gap: spacing.xs,
  },
  transliteration: {
    ...typography.caption,
    color: palette.pinkStart,
  },
  meaning: {
    ...typography.small,
    color: palette.textSecondary,
  },
  cardRight: {
    alignItems: 'center',
    gap: spacing.sm,
    marginLeft: spacing.md,
  },
  countBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.pinkStart,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    ...typography.caption,
    color: palette.white,
    fontWeight: '700',
  },
});

export default DhikrListScreen;
