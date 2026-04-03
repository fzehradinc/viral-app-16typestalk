/**
 * QuranHomeScreen — Sure listesi + arama.
 */

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  FlatList,
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
import {GradientBackground} from '../components';
import {SurahRow, SkeletonRow} from '../components/quran';
import {useQuranStore} from '../store/quranStore';
import {useLanguageStore} from '../store/languageStore';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import type {SurahSummary} from '../types';
import type {QuranStackParamList} from '../navigation/types';

type Nav = NativeStackNavigationProp<QuranStackParamList>;

const SKELETON_DATA = Array.from({length: 10}, (_, i) => i);
const ITEM_HEIGHT = 72;

function QuranHomeScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const {surahList, isLoadingSurahList, loadSurahList} = useQuranStore();
  const {currentLanguage} = useLanguageStore();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSurahList();
  }, [loadSurahList]);

  const filteredSurahs = useMemo(() => {
    if (!searchQuery.trim()) {
      return surahList;
    }
    const q = searchQuery.toLowerCase();
    return surahList.filter(
      s =>
        s.englishName.toLowerCase().includes(q) ||
        s.name.includes(searchQuery) ||
        s.number.toString() === searchQuery.trim(),
    );
  }, [surahList, searchQuery]);

  const handleSurahPress = useCallback(
    (surah: SurahSummary) => {
      navigation.navigate('QuranReader', {
        surahNumber: surah.number,
        surahName: surah.englishName,
        surahArabicName: surah.name,
        numberOfAyahs: surah.numberOfAyahs,
      });
    },
    [navigation],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback(
    ({item}: {item: SurahSummary}) => (
      <SurahRow surah={item} onPress={() => handleSurahPress(item)} />
    ),
    [handleSurahPress],
  );

  const keyExtractor = useCallback(
    (item: SurahSummary) => item.number.toString(),
    [],
  );

  const title =
    currentLanguage === 'tr' ? "Kur'an-ı Kerim" : 'The Holy Quran';
  const subtitle =
    currentLanguage === 'tr'
      ? 'Oku, Dinle, Tefekkür Et'
      : 'Read, Recite, and Reflect';
  const searchPlaceholder =
    currentLanguage === 'tr' ? 'Sure ara...' : 'Search surah...';

  return (
    <View style={styles.root}>
      <GradientBackground />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Arama kutusu */}
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={18}
              color="rgba(255,255,255,0.5)"
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor="rgba(255,255,255,0.5)"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                hitSlop={8}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color="rgba(255,255,255,0.5)"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Sure listesi */}
        {isLoadingSurahList ? (
          <View style={styles.skeletonContainer}>
            {SKELETON_DATA.map(i => (
              <SkeletonRow key={i} />
            ))}
          </View>
        ) : filteredSurahs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {currentLanguage === 'tr'
                ? 'Sonuç bulunamadı'
                : 'No results found'}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredSurahs}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        )}
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
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: palette.white,
  },
  subtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: spacing.xs,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 16,
    marginTop: spacing.md,
    paddingHorizontal: spacing.sm,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: palette.white,
    paddingVertical: 0,
  },
  skeletonContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: palette.textSecondary,
  },
});

export default QuranHomeScreen;
