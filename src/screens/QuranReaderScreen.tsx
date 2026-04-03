/**
 * QuranReaderScreen — Ayet okuyucu.
 * Arapça metin + çeviri, bookmark, Bismiallah banner.
 */

import React, {useCallback, useEffect, useRef} from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import type {RouteProp} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import {GradientBackground} from '../components';
import {AyahItem, AyahSkeleton} from '../components/quran';
import {useQuranStore} from '../store/quranStore';
import {useLanguageStore} from '../store/languageStore';
import {palette, gradients} from '../theme/colors';
import {spacing} from '../theme/spacing';
import type {AyahDetail} from '../types';
import type {QuranStackParamList} from '../navigation/types';

const SKELETON_DATA = Array.from({length: 5}, (_, i) => i);
const BISMILLAH = 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ';

function QuranReaderScreen(): React.JSX.Element {
  const navigation = useNavigation();
  const route =
    useRoute<RouteProp<QuranStackParamList, 'QuranReader'>>();
  const {surahNumber, surahName, surahArabicName, initialAyah} =
    route.params;

  const {
    currentSurah,
    isLoadingReader,
    loadSurah,
    toggleBookmark,
    bookmarkedAyahs,
  } = useQuranStore();
  const {currentLanguage} = useLanguageStore();

  const flatListRef = useRef<FlatList<AyahDetail>>(null);

  useEffect(() => {
    loadSurah(surahNumber, currentLanguage);
  }, [surahNumber, currentLanguage, loadSurah]);

  // initialAyah scroll
  useEffect(() => {
    if (
      initialAyah &&
      currentSurah &&
      currentSurah.arabic.number === surahNumber
    ) {
      const idx = initialAyah - 1;
      if (idx >= 0 && idx < currentSurah.arabic.ayahs.length) {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({index: idx, animated: false});
        }, 300);
      }
    }
  }, [initialAyah, currentSurah, surahNumber]);

  const handleGoBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleOptions = useCallback(() => {
    // TODO: Faz 5 — dil seçim sheet
  }, []);

  const handleScrollToIndexFailed = useCallback(
    (info: {index: number; averageItemLength: number}) => {
      flatListRef.current?.scrollToOffset({
        offset: info.averageItemLength * info.index,
        animated: false,
      });
    },
    [],
  );

  const showBismillah = surahNumber !== 1 && surahNumber !== 9;

  const ayahs = currentSurah?.arabic.ayahs ?? [];
  const translationAyahs = currentSurah?.translation.ayahs ?? [];

  const renderHeader = useCallback(() => {
    if (!showBismillah) {
      return null;
    }
    return (
      <LinearGradient
        colors={[...gradients.pink]}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.bismillahCard}>
        <Text style={styles.bismillahText}>{BISMILLAH}</Text>
      </LinearGradient>
    );
  }, [showBismillah]);

  const renderItem = useCallback(
    ({item, index}: {item: AyahDetail; index: number}) => {
      const trans = translationAyahs[index];
      if (!trans) {
        return null;
      }
      return (
        <AyahItem
          ayah={item}
          translation={trans}
          isBookmarked={bookmarkedAyahs.includes(item.number)}
          onBookmark={() => toggleBookmark(item.number)}
          language={currentLanguage}
          surahNumber={surahNumber}
        />
      );
    },
    [
      translationAyahs,
      bookmarkedAyahs,
      toggleBookmark,
      currentLanguage,
      surahNumber,
    ],
  );

  const keyExtractor = useCallback(
    (item: AyahDetail) => item.number.toString(),
    [],
  );

  return (
    <View style={styles.root}>
      <GradientBackground />

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Custom header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack} hitSlop={8}>
            <Ionicons name="chevron-back" size={26} color={palette.white} />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {surahName}
            </Text>
            <Text style={styles.headerSubtitle}>{surahArabicName}</Text>
          </View>

          <TouchableOpacity onPress={handleOptions} hitSlop={8}>
            <Ionicons
              name="options-outline"
              size={22}
              color={palette.white}
            />
          </TouchableOpacity>
        </View>

        {/* İçerik */}
        {isLoadingReader ? (
          <View style={styles.skeletonContainer}>
            {SKELETON_DATA.map(i => (
              <AyahSkeleton key={i} />
            ))}
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={ayahs}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ListHeaderComponent={renderHeader}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            onScrollToIndexFailed={handleScrollToIndexFailed}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: spacing.sm,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: palette.textSecondary,
    marginTop: 2,
  },
  bismillahCard: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.md,
    borderRadius: 20,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  bismillahText: {
    fontSize: 28,
    color: palette.white,
    fontWeight: '600',
    writingDirection: 'rtl',
    textAlign: 'center',
    lineHeight: 44,
  },
  skeletonContainer: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 120,
  },
});

export default QuranReaderScreen;
