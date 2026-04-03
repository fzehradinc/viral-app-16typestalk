import React from 'react';
import {StyleSheet, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

/**
 * GradientBackground
 *
 * Swift'teki PinkArabicHeartBackground'ın React Native karşılığı.
 * Koyu mor ana gradient üzerine pembe parlama efekti katmanlanır.
 * Tüm ekranların arka planı olarak kullanılır.
 */

interface GradientBackgroundProps {
  children?: React.ReactNode;
}

function GradientBackground({
  children,
}: GradientBackgroundProps): React.JSX.Element {
  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Ana koyu mor gradient */}
      <LinearGradient
        colors={['#2D1B4E', '#1A0A2E', '#0D0520']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Pembe parlama efekti — üst orta */}
      <LinearGradient
        colors={[
          'rgba(255,143,177,0.15)',
          'rgba(255,143,177,0.05)',
          'transparent',
        ]}
        locations={[0, 0.4, 1]}
        start={{x: 0.5, y: 0}}
        end={{x: 0.5, y: 0.6}}
        style={StyleSheet.absoluteFill}
      />

      {/* Mor parlama efekti — alt sol */}
      <LinearGradient
        colors={[
          'transparent',
          'rgba(184,79,235,0.08)',
          'rgba(139,47,212,0.12)',
        ]}
        locations={[0.3, 0.7, 1]}
        start={{x: 0, y: 0.5}}
        end={{x: 1, y: 1}}
        style={StyleSheet.absoluteFill}
      />

      {children}
    </View>
  );
}

export default GradientBackground;

/**
 * Çok katmanlı gradient stratejisi:
 * 1. Ana katman: koyu mor degrade → sayfa arka planı.
 * 2. Pembe parlama: üstten aşağı soluk pembe → sıcak vurgu.
 * 3. Mor parlama: alt-soldan → derinlik hissi.
 * Bu 3 katman Swift versiyonundaki radialGradient efektini
 * LinearGradient ile taklit eder.
 */
