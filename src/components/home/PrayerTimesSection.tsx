/**
 * PrayerTimesSection — yatay kayan namaz vakitleri bölümü.
 * 6 namaz kartı (Fajr–Isha), konum bilgisi ve yenile butonu.
 */

import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import PrayerCard from './PrayerCard';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';
import type {PrayerTimesData} from '../../services/prayerTimesService';

interface PrayerTimesSectionProps {
  prayerTimes: PrayerTimesData;
  locationName: string;
  locationStatus: string;
  onRefresh: () => void;
}

interface PrayerInfo {
  nameKey: string;
  timeKey: keyof PrayerTimesData;
  icon: string;
  iconColor: string;
}

const PRAYERS: PrayerInfo[] = [
  {nameKey: 'prayer.fajr', timeKey: 'fajr', icon: 'sunny-outline', iconColor: palette.pinkStart},
  {nameKey: 'prayer.sunrise', timeKey: 'sunrise', icon: 'partly-sunny-outline', iconColor: '#C97BDB'},
  {nameKey: 'prayer.dhuhr', timeKey: 'dhuhr', icon: 'sunny', iconColor: '#F0C040'},
  {nameKey: 'prayer.asr', timeKey: 'asr', icon: 'partly-sunny', iconColor: palette.pinkStart},
  {nameKey: 'prayer.maghrib', timeKey: 'maghrib', icon: 'sunset-outline', iconColor: palette.pinkEnd},
  {nameKey: 'prayer.isha', timeKey: 'isha', icon: 'moon', iconColor: palette.purpleStart},
];

function PrayerTimesSection({
  prayerTimes,
  locationName,
  locationStatus,
  onRefresh,
}: PrayerTimesSectionProps): React.JSX.Element {
  const {t} = useTranslation();

  return (
    <View style={styles.wrapper}>
      {/* Başlık satırı */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.label}>
            {t('prayer.prayerTimes').toUpperCase()}
          </Text>
          {locationStatus === 'loading' ? (
            <ActivityIndicator
              size="small"
              color={palette.pinkStart}
              style={styles.locationLoader}
            />
          ) : locationName ? (
            <Text style={styles.location} numberOfLines={1}>
              <Icon name="location-outline" size={12} color={palette.textSecondary} />{' '}
              {locationName}
            </Text>
          ) : null}
        </View>

        <TouchableOpacity onPress={onRefresh} hitSlop={12}>
          <Icon name="refresh-outline" size={20} color={palette.pinkStart} />
        </TouchableOpacity>
      </View>

      {/* Kart listesi */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}>
        {PRAYERS.map(p => (
          <PrayerCard
            key={p.timeKey}
            name={t(p.nameKey)}
            time={prayerTimes[p.timeKey]}
            icon={p.icon}
            iconColor={p.iconColor}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.pinkStart,
    letterSpacing: 1.5,
  },
  location: {
    fontSize: 13,
    fontWeight: '500',
    color: palette.textSecondary,
    marginTop: 2,
  },
  locationLoader: {
    marginTop: spacing.xs,
    alignSelf: 'flex-start',
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
  },
});

export default PrayerTimesSection;
