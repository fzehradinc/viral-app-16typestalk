/**
 * ReflectCalendarScreen — takvim görünümü ile tefekkür girdileri.
 * react-native-calendars ile işaretli günler ve mini önizleme.
 */

import React, {useMemo, useState} from 'react';
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Calendar} from 'react-native-calendars';
import type {DateData} from 'react-native-calendars';
import type {Theme} from 'react-native-calendars/src/types';
import {GradientBackground, GlassCard} from '../components';
import {useReflectionStore} from '../store/reflectionStore';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import {typography} from '../theme/typography';
import type {ReflectStackParamList} from '../navigation/types';
import type {ReflectionEntry} from '../types';

type Nav = NativeStackNavigationProp<ReflectStackParamList>;

const calendarTheme: Theme = {
  backgroundColor: 'transparent',
  calendarBackground: 'transparent',
  textSectionTitleColor: 'rgba(255,255,255,0.6)',
  selectedDayBackgroundColor: palette.pinkStart,
  selectedDayTextColor: palette.white,
  todayTextColor: palette.pinkStart,
  dayTextColor: palette.white,
  textDisabledColor: 'rgba(255,255,255,0.3)',
  dotColor: palette.pinkStart,
  arrowColor: palette.pinkStart,
  monthTextColor: palette.white,
  textDayFontWeight: '500',
  textMonthFontWeight: 'bold',
};

function ReflectCalendarScreen(): React.JSX.Element {
  const navigation = useNavigation<Nav>();
  const {allEntries} = useReflectionStore();
  const [selectedEntry, setSelectedEntry] = useState<ReflectionEntry | null>(
    null,
  );
  const [selectedDateStr, setSelectedDateStr] = useState('');

  const markedDates = useMemo(() => {
    const marks: Record<
      string,
      {marked: boolean; dotColor: string; selected?: boolean; selectedColor?: string}
    > = {};
    allEntries.forEach(entry => {
      marks[entry.date] = {
        marked: true,
        dotColor: palette.pinkStart,
      };
    });
    if (selectedDateStr) {
      marks[selectedDateStr] = {
        ...marks[selectedDateStr],
        selected: true,
        selectedColor: palette.pinkStart,
        marked: marks[selectedDateStr]?.marked ?? false,
        dotColor: marks[selectedDateStr]?.dotColor ?? palette.pinkStart,
      };
    }
    return marks;
  }, [allEntries, selectedDateStr]);

  const handleDayPress = (day: DateData) => {
    setSelectedDateStr(day.dateString);
    const entry = allEntries.find(e => e.date === day.dateString);
    setSelectedEntry(entry ?? null);
  };

  const handleViewFull = () => {
    if (selectedEntry) {
      navigation.navigate('ReflectDetail', {
        entryId: selectedEntry.id,
        date: selectedEntry.date,
      });
    }
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Ionicons
                name="chevron-back"
                size={24}
                color={palette.white}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Diary Calendar</Text>
            <View style={styles.headerSpacer} />
          </View>

          {/* Calendar */}
          <Calendar
            theme={calendarTheme}
            markedDates={markedDates}
            markingType="dot"
            onDayPress={handleDayPress}
            enableSwipeMonths
          />

          {/* Selected Day Preview */}
          {selectedDateStr !== '' && (
            <View style={styles.previewSection}>
              {selectedEntry ? (
                <GlassCard style={styles.previewCard}>
                  <View style={styles.previewHeader}>
                    <View style={styles.previewBadge}>
                      <Text style={styles.previewBadgeText}>
                        {selectedEntry.topic}
                      </Text>
                    </View>
                    <Text style={styles.previewDate}>{selectedEntry.date}</Text>
                  </View>
                  <Text style={styles.previewContent} numberOfLines={3}>
                    {selectedEntry.content}
                  </Text>
                  <TouchableOpacity
                    style={styles.viewFullButton}
                    onPress={handleViewFull}>
                    <Text style={styles.viewFullText}>View full</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={palette.pinkStart}
                    />
                  </TouchableOpacity>
                </GlassCard>
              ) : (
                <Text style={styles.noEntryText}>
                  No reflections for this date.
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
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
  previewSection: {
    marginTop: spacing.lg,
  },
  previewCard: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  previewBadge: {
    backgroundColor: palette.glass,
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  previewBadgeText: {
    ...typography.small,
    color: palette.pinkStart,
    textTransform: 'capitalize',
  },
  previewDate: {
    ...typography.small,
    color: palette.textSecondary,
  },
  previewContent: {
    ...typography.body,
    color: palette.white,
  },
  viewFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-end',
  },
  viewFullText: {
    ...typography.caption,
    color: palette.pinkStart,
  },
  noEntryText: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: 'center',
    opacity: 0.5,
  },
});

export default ReflectCalendarScreen;
