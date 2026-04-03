/**
 * FeaturedCarousel — 4 kart yatay kaydırma.
 * Sunnah, Dua, Journey Tip, Quran Spotlight kartları.
 */

import React, {useCallback, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  type ViewToken,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {AppLanguage} from '../../types';

interface FeaturedCarouselProps {
  currentLanguage: AppLanguage;
}

interface CarouselItem {
  id: string;
  titleKey: string;
  subtitleKey: string;
  icon: string;
  color: string;
  bgColor: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - spacing.xxl * 2 + spacing.lg;

const ITEMS: CarouselItem[] = [
  {
    id: 'sunnah',
    titleKey: 'Sunnah of the Day',
    subtitleKey: 'Daily prophetic practice',
    icon: 'sunny-outline',
    color: '#FF9F43',
    bgColor: 'rgba(255,159,67,0.18)',
  },
  {
    id: 'dua',
    titleKey: 'Special Dua',
    subtitleKey: 'Curated supplication',
    icon: 'heart-outline',
    color: palette.pinkStart,
    bgColor: 'rgba(255,143,177,0.18)',
  },
  {
    id: 'tip',
    titleKey: 'Journey Tip',
    subtitleKey: 'Spiritual growth insight',
    icon: 'compass-outline',
    color: palette.pinkEnd,
    bgColor: 'rgba(240,114,163,0.18)',
  },
  {
    id: 'spotlight',
    titleKey: 'Quran Spotlight',
    subtitleKey: 'Featured surah highlight',
    icon: 'book-outline',
    color: '#E74C3C',
    bgColor: 'rgba(231,76,60,0.18)',
  },
];

function FeaturedCarousel({
  currentLanguage: _currentLanguage,
}: FeaturedCarouselProps): React.JSX.Element {
  const {t: _t} = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  const onViewableItemsChanged = useCallback(
    ({viewableItems}: {viewableItems: ViewToken[]}) => {
      if (viewableItems.length > 0 && viewableItems[0].index != null) {
        setActiveIndex(viewableItems[0].index);
      }
    },
    [],
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const renderItem = useCallback(
    ({item}: {item: CarouselItem}) => (
      <TouchableOpacity activeOpacity={0.85} style={styles.card}>
        <View style={[styles.iconCircle, {backgroundColor: item.bgColor}]}>
          <Icon name={item.icon} size={22} color={item.color} />
        </View>

        <View style={styles.cardText}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.titleKey}
          </Text>
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {item.subtitleKey}
          </Text>
        </View>

        <Icon name="chevron-forward" size={18} color={palette.textSecondary} />
      </TouchableOpacity>
    ),
    [],
  );

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={ITEMS}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + spacing.sm}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />

      {/* Sayfa göstergesi */}
      <View style={styles.dots}>
        {ITEMS.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.dot,
              index === activeIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  card: {
    width: CARD_WIDTH,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cardText: {
    flex: 1,
    marginRight: spacing.sm,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.white,
  },
  cardSubtitle: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.textSecondary,
    marginTop: 2,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
  },
  dot: {
    borderRadius: 4,
  },
  dotActive: {
    width: 20,
    height: 8,
    backgroundColor: palette.pinkStart,
    borderRadius: 4,
  },
  dotInactive: {
    width: 8,
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
});

export default FeaturedCarousel;
