import {Platform} from 'react-native';

/**
 * Noorbloom Typography Scale
 *
 * System font (rounded design) kullanılarak oluşturulmuş
 * tutarlı tipografi skalası.
 * iOS'ta SF Pro Rounded, Android'de system default kullanılır.
 */

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  display: {
    fontFamily,
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  title: {
    fontFamily,
    fontSize: 26,
    fontWeight: '700' as const,
    lineHeight: 34,
  },
  heading: {
    fontFamily,
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontFamily,
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  caption: {
    fontFamily,
    fontSize: 13,
    fontWeight: '500' as const,
    lineHeight: 18,
  },
  small: {
    fontFamily,
    fontSize: 11,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
} as const;

export type TypographyVariant = keyof typeof typography;

/**
 * Sistem fontu tercih edildi çünkü:
 * 1. iOS'ta SF Pro Rounded otomatik gelir — native görünüm sağlar.
 * 2. Ekstra font dosyası yükü yok.
 * 3. Her iki platformda tutarlı lineHeight oranları ile okunabilirlik korunur.
 */
