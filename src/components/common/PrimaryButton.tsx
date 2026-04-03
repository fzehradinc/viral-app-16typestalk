import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {palette} from '../../theme/colors';
import {typography} from '../../theme/typography';
import {spacing} from '../../theme/spacing';

/**
 * PrimaryButton
 *
 * Üç varyantlı çok amaçlı buton bileşeni.
 * primary: pembe gradient arka plan
 * secondary: cam efekti arka plan
 * ghost: yalnızca border
 */

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}

function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
}: PrimaryButtonProps): React.JSX.Element {
  const isDisabled = disabled || loading;

  const content = loading ? (
    <ActivityIndicator size="small" color={palette.white} />
  ) : (
    <Text style={[styles.text, variant === 'ghost' && styles.ghostText]}>
      {title}
    </Text>
  );

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        activeOpacity={0.8}>
        <LinearGradient
          colors={[palette.pinkStart, palette.pinkEnd]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={[styles.base, isDisabled && styles.disabled]}>
          {content}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
      style={[
        styles.base,
        variant === 'secondary' && styles.secondary,
        variant === 'ghost' && styles.ghost,
        isDisabled && styles.disabled,
      ]}>
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  secondary: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'rgba(255,255,255,0.3)',
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.body,
    fontWeight: '600',
    color: palette.white,
  },
  ghostText: {
    color: 'rgba(255,255,255,0.8)',
  },
});

export default PrimaryButton;

/**
 * Varyant sistemi seçildi çünkü:
 * 1. Tek bileşen, üç görünüm → import kalabalığı azalır.
 * 2. Primary gradient, TouchableOpacity + LinearGradient ile sarılır.
 * 3. Loading durumunda ActivityIndicator gösterilerek çift tıklama önlenir.
 * 4. disabled ve loading prop'ları opacity = 0.5 ile görsel geri bildirim verir.
 */
