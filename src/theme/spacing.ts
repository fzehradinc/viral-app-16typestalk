/**
 * Noorbloom Spacing Scale
 *
 * 4'ün katları (4-point grid) sistemi.
 * Tüm margin, padding ve gap değerleri bu skaladan seçilir;
 * böylece UI tutarlı bir ritme sahip olur.
 */

export const spacing = {
  /** 4px — ikon içi boşluk, çok küçük ayırıcı */
  xs: 4,
  /** 8px — kompakt elemanlar arası */
  sm: 8,
  /** 16px — standart bileşen iç boşluğu */
  md: 16,
  /** 24px — kart içi padding, bölümler arası */
  lg: 24,
  /** 32px — ekran kenar boşlukları */
  xl: 32,
  /** 48px — büyük bölüm ayırıcı */
  xxl: 48,
} as const;

export type SpacingKey = keyof typeof spacing;

/**
 * 4-point grid seçildi çünkü:
 * 1. Hem iOS (8pt grid) hem Android (4dp grid) ile doğal uyum sağlar.
 * 2. Tasarım-to-kod dönüşümlerinde belirsizliği ortadan kaldırır.
 * 3. Küçük (xs) ve büyük (xxl) uçlar arasında yeterli çeşitlilik sunar.
 */
