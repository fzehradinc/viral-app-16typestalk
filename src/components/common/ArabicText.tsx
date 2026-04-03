import React from 'react';
import {Platform, StyleSheet, Text, type TextStyle} from 'react-native';
import {darkTheme} from '../../theme/colors';

/**
 * ArabicText
 *
 * Arapça metin render bileşeni.
 * RTL yönlendirme, uygun font ailesi ve boyut skalası sağlar.
 */

interface ArabicTextProps {
  text: string;
  size?: 'small' | 'medium' | 'large' | 'display';
  style?: TextStyle;
}

const ARABIC_FONT = Platform.select({
  ios: 'GeezaPro',
  android: 'sans-serif',
  default: 'sans-serif',
});

const SIZE_MAP = {
  small: 18,
  medium: 28,
  large: 38,
  display: 52,
} as const;

const LINE_HEIGHT_MAP = {
  small: 28,
  medium: 42,
  large: 56,
  display: 72,
} as const;

function ArabicText({
  text,
  size = 'medium',
  style,
}: ArabicTextProps): React.JSX.Element {
  return (
    <Text
      style={[
        styles.base,
        {
          fontSize: SIZE_MAP[size],
          lineHeight: LINE_HEIGHT_MAP[size],
        },
        style,
      ]}>
      {text}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: ARABIC_FONT,
    writingDirection: 'rtl',
    textAlign: 'right',
    color: darkTheme.textPrimary,
  },
});

export default ArabicText;

/**
 * Arapça metin kararları:
 * 1. iOS → GeezaPro: sistem Arapça fontu, yükleme gerektirmez.
 * 2. Android → sans-serif: Noto Naskh Arabic fallback olarak kullanılır.
 * 3. İlerleyen promptlarda özel font (Amiri, Scheherazade New) eklenebilir.
 * 4. lineHeight fontSize'ın ~1.5x katı → Arapça harfler kesişmez.
 */
