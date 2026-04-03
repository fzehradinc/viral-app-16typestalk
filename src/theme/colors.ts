/**
 * Noorbloom Color Palette
 *
 * Migrated from Swift AppTheme.swift and Color+Hex.swift.
 * Organized as a theme object supporting both dark and light modes.
 * Dark theme is primary since the app uses a dark-based luxurious UI.
 */

export const palette = {
  /** Ana pembe gradient başlangıç */
  pinkStart: '#FF8FB1',
  /** Ana pembe gradient bitiş */
  pinkEnd: '#F072A3',
  /** Mor gradient başlangıç */
  purpleStart: '#B84FEB',
  /** Mor gradient bitiş */
  purpleEnd: '#8B2FD4',
  /** Koyu arka plan */
  backgroundDark: '#1A0A2E',
  /** Cam efekti (glassmorphism) */
  glass: 'rgba(255,255,255,0.08)',
  /** Beyaz — birincil metin */
  white: '#FFFFFF',
  /** İkincil metin */
  textSecondary: 'rgba(255,255,255,0.7)',
  /** Siyah */
  black: '#000000',
  /** Açık arka plan (light tema) */
  backgroundLight: '#F8F0FF',
} as const;

export const gradients = {
  pink: [palette.pinkStart, palette.pinkEnd] as const,
  purple: [palette.purpleStart, palette.purpleEnd] as const,
} as const;

export const darkTheme = {
  background: palette.backgroundDark,
  surface: palette.glass,
  textPrimary: palette.white,
  textSecondary: palette.textSecondary,
  tabBarActive: palette.pinkStart,
  tabBarInactive: palette.textSecondary,
  tabBarBackground: palette.backgroundDark,
  statusBar: 'light-content' as const,
} as const;

export const lightTheme = {
  background: palette.backgroundLight,
  surface: 'rgba(0,0,0,0.04)',
  textPrimary: palette.backgroundDark,
  textSecondary: 'rgba(26,10,46,0.6)',
  tabBarActive: palette.pinkEnd,
  tabBarInactive: 'rgba(26,10,46,0.4)',
  tabBarBackground: palette.white,
  statusBar: 'dark-content' as const,
} as const;

export type AppTheme = typeof darkTheme;

/**
 * Dark-first yaklaşımı: Uygulamanın lüks, karanlık estetik kimliği
 * korunurken light tema da destekleniyor. palette nesnesi ham renkleri,
 * darkTheme / lightTheme nesneleri ise semantik token'ları sağlar.
 */
