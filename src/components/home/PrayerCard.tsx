/**
 * PrayerCard — tekil namaz vakti kartı.
 * Cam efekti arka plan, renkli ikon, vakti ve namaz adını gösterir.
 */

import React from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {palette} from '../../theme/colors';
import {spacing} from '../../theme/spacing';

interface PrayerCardProps {
  name: string;
  time: string;
  icon: string;
  iconColor: string;
}

function PrayerCard({
  name,
  time,
  icon,
  iconColor,
}: PrayerCardProps): React.JSX.Element {
  return (
    <View style={styles.card}>
      <View style={[styles.iconCircle, {backgroundColor: iconColor + '20'}]}>
        <Icon name={icon} size={20} color={iconColor} />
      </View>
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 95,
    height: 125,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {
    fontSize: 11,
    fontWeight: '700',
    color: palette.white,
    opacity: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
  },
  time: {
    fontSize: 17,
    fontWeight: '900',
    color: palette.white,
  },
});

export default PrayerCard;
