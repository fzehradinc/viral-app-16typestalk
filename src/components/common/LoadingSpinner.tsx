import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {palette} from '../../theme/colors';

/**
 * LoadingSpinner
 *
 * Merkezlenmiş pembe spinner.
 * Yükleme durumlarında tek satırla kullanılır.
 */

function LoadingSpinner(): React.JSX.Element {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={palette.pinkStart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingSpinner;

/**
 * Basit, tek sorumluluk: tam ekran ortasında pembe spinner.
 * Daha karmaşık skeleton/shimmer loader'lar ilerleyen promptlarda eklenebilir.
 */
