/**
 * RamadanTrackerScreen — 30 günlük oruç/Teravih takibi.
 * HomeScreen'den fullscreen modal olarak açılır.
 */

import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Modal,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {useTranslation} from 'react-i18next';
import {GradientBackground, GlassCard} from '../components';
import {useRamadanStore} from '../store/ramadanStore';
import {palette} from '../theme/colors';
import {spacing} from '../theme/spacing';
import type {RamadanDay, FastingStatus} from '../types';

const {width: SCREEN_WIDTH} = Dimensions.get('window');
const NUM_COLUMNS = 6;
const CELL_GAP = 8;
const GRID_PADDING = spacing.lg;
const CELL_SIZE =
  (SCREEN_WIDTH - GRID_PADDING * 2 - (NUM_COLUMNS - 1) * CELL_GAP) / NUM_COLUMNS;

const STATUS_COLORS: Record<FastingStatus, string> = {
  fasted: 'rgba(29,158,117,0.8)',
  missed: 'rgba(226,75,74,0.7)',
  excused: 'rgba(239,159,39,0.7)',
  pending: 'rgba(255,255,255,0.08)',
};

const STATUS_OPTIONS: {status: FastingStatus; label: string; icon: string}[] = [
  {status: 'fasted', label: 'Fasted', icon: 'checkmark-circle'},
  {status: 'missed', label: 'Missed', icon: 'close-circle'},
  {status: 'excused', label: 'Excused', icon: 'remove-circle'},
];

function RamadanTrackerScreen(): React.JSX.Element {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {
    ramadanData,
    initialize,
    updateDayStatus,
    toggleTarawih,
    toggleIftarReminder,
    toggleSuhoorReminder,
    currentDayNumber,
    getStats,
  } = useRamadanStore();

  const [selectedDay, setSelectedDay] = useState<RamadanDay | null>(null);
  const [dayModalVisible, setDayModalVisible] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const stats = useMemo(() => getStats(), [getStats, ramadanData]);

  const handleDayPress = useCallback((day: RamadanDay) => {
    setSelectedDay(day);
    setDayModalVisible(true);
  }, []);

  const handleStatusSelect = useCallback(
    async (status: FastingStatus) => {
      if (selectedDay) {
        await updateDayStatus(selectedDay.dayNumber, status);
        setSelectedDay(prev =>
          prev ? {...prev, fastingStatus: status} : null,
        );
      }
    },
    [selectedDay, updateDayStatus],
  );

  const handleTarawihToggle = useCallback(async () => {
    if (selectedDay) {
      await toggleTarawih(selectedDay.dayNumber);
      setSelectedDay(prev =>
        prev ? {...prev, tarawihCompleted: !prev.tarawihCompleted} : null,
      );
    }
  }, [selectedDay, toggleTarawih]);

  const handleClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderDayCell = useCallback(
    ({item}: {item: RamadanDay}) => {
      const isToday = item.dayNumber === currentDayNumber;
      return (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => handleDayPress(item)}
          style={[
            styles.dayCell,
            {
              backgroundColor: STATUS_COLORS[item.fastingStatus],
              width: CELL_SIZE,
              height: CELL_SIZE,
            },
            isToday && styles.dayCellToday,
          ]}>
          <Text style={styles.dayNumber}>{item.dayNumber}</Text>
          {item.tarawihCompleted && (
            <Text style={styles.tarawihCheck}>✓</Text>
          )}
        </TouchableOpacity>
      );
    },
    [currentDayNumber, handleDayPress],
  );

  const keyExtractor = useCallback(
    (item: RamadanDay) => String(item.dayNumber),
    [],
  );

  if (!ramadanData) {
    return (
      <GradientBackground>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground>
      <View style={[styles.container, {paddingTop: insets.top}]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Icon name="close" size={28} color={palette.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t("ramadan.title")}</Text>
          <Text style={styles.headerYear}>{ramadanData.year}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalFasted}</Text>
            <Text style={styles.statLabel}>Fasted</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalMissed}</Text>
            <Text style={styles.statLabel}>Missed</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalTarawih}</Text>
            <Text style={styles.statLabel}>Tarawih</Text>
          </GlassCard>
        </View>

        {/* 30-day grid */}
        <FlatList
          data={ramadanData.days}
          renderItem={renderDayCell}
          keyExtractor={keyExtractor}
          numColumns={NUM_COLUMNS}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.gridContainer}
          scrollEnabled={false}
        />

        {/* Reminders */}
        <GlassCard style={styles.remindersCard}>
          <Text style={styles.remindersTitle}>Reminders</Text>
          <View style={styles.reminderRow}>
            <Text style={styles.reminderLabel}>
              {t("ramadan.iftar")} Reminder
            </Text>
            <Switch
              value={ramadanData.iftarReminderEnabled}
              onValueChange={v => toggleIftarReminder(v)}
              trackColor={{false: '#555', true: palette.pinkStart}}
              thumbColor={palette.white}
            />
          </View>
          <View style={styles.reminderRow}>
            <Text style={styles.reminderLabel}>
              {t("ramadan.suhoor")} Reminder
            </Text>
            <Switch
              value={ramadanData.suhoorReminderEnabled}
              onValueChange={v => toggleSuhoorReminder(v)}
              trackColor={{false: '#555', true: palette.pinkStart}}
              thumbColor={palette.white}
            />
          </View>
          <Text style={styles.reminderNote}>
            Based on your prayer times
          </Text>
        </GlassCard>
      </View>

      {/* Day detail modal */}
      <Modal
        visible={dayModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDayModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Day {selectedDay?.dayNumber}
            </Text>

            <Text style={styles.modalSectionTitle}>Fasting Status</Text>
            <View style={styles.statusOptions}>
              {STATUS_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.status}
                  style={[
                    styles.statusBtn,
                    {
                      backgroundColor: STATUS_COLORS[opt.status],
                      borderWidth:
                        selectedDay?.fastingStatus === opt.status ? 2 : 0,
                      borderColor: palette.white,
                    },
                  ]}
                  onPress={() => handleStatusSelect(opt.status)}>
                  <Icon name={opt.icon} size={20} color={palette.white} />
                  <Text style={styles.statusBtnText}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.tarawihRow}>
              <Text style={styles.modalSectionTitle}>
                {t("ramadan.taraweeh")}
              </Text>
              <Switch
                value={selectedDay?.tarawihCompleted ?? false}
                onValueChange={handleTarawihToggle}
                trackColor={{false: '#555', true: '#1D9E75'}}
                thumbColor={palette.white}
              />
            </View>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setDayModalVisible(false)}>
              <Text style={styles.modalCloseBtnText}>{t("common.close")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: GRID_PADDING,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: palette.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  closeBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.white,
  },
  headerYear: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.white,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.6)',
    marginTop: spacing.xs,
  },
  gridContainer: {
    marginBottom: spacing.lg,
  },
  gridRow: {
    justifyContent: 'flex-start',
    gap: CELL_GAP,
    marginBottom: CELL_GAP,
  },
  dayCell: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellToday: {
    borderWidth: 2,
    borderColor: palette.pinkStart,
  },
  dayNumber: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.white,
  },
  tarawihCheck: {
    fontSize: 10,
    color: '#1D9E75',
    marginTop: 1,
  },
  remindersCard: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },
  remindersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: palette.white,
    marginBottom: spacing.md,
  },
  reminderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  reminderLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: palette.white,
  },
  reminderNote: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: spacing.xs,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: SCREEN_WIDTH - spacing.xl * 2,
    backgroundColor: '#2D1B4E',
    borderRadius: 20,
    padding: spacing.lg,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: palette.white,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: spacing.sm,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  statusBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderRadius: 12,
    gap: spacing.xs,
  },
  statusBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: palette.white,
  },
  tarawihRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  modalCloseBtn: {
    alignSelf: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
  },
  modalCloseBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: palette.white,
  },
});

export default RamadanTrackerScreen;
